import { useEffect, useMemo, useState } from "react";
import { getAppointmentHistoryRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import { formatDateTime } from "../utils/date";

function getWeekRange(selectedDate: string) {
  const date = new Date(`${selectedDate}T12:00:00`);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() + diffToMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const toInputDate = (value: Date) => value.toISOString().split("T")[0];

  return {
    startDate: toInputDate(weekStart),
    endDate: toInputDate(weekEnd),
  };
}

export function useWeeklyAppointmentWarning(
  selectedDate: string,
  serviceIds: number[],
) {
  const [hasWeeklyAppointment, setHasWeeklyAppointment] = useState(false);
  const [warningDate, setWarningDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const serviceIdsKey = useMemo(() => serviceIds.join(","), [serviceIds]);

  useEffect(() => {
    async function loadWarning() {
      if (!selectedDate || serviceIds.length === 0) {
        setHasWeeklyAppointment(false);
        setWarningDate("");
        setErrorMessage("");
        return;
      }

      setErrorMessage("");

      try {
        const { startDate, endDate } = getWeekRange(selectedDate);
        const response = await getAppointmentHistoryRequest({
          startDate,
          endDate,
        });

        const firstAppointment = (response.data ?? [])[0];

        setHasWeeklyAppointment(Boolean(firstAppointment));
        setWarningDate(firstAppointment?.startDate?.toString() ?? "");
      } catch (error) {
        setHasWeeklyAppointment(false);
        setWarningDate("");

        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            "Não foi possível verificar se já existe um agendamento nesta semana.",
          );
        }
      }
    }

    void loadWarning();
  }, [selectedDate, serviceIds, serviceIdsKey]);

  const warningMessage = useMemo(() => {
    if (!hasWeeklyAppointment || !warningDate) {
      return "";
    }

    return `Você já possui um agendamento nesta semana em ${formatDateTime(warningDate)}. Considere concentrar os serviços na mesma data.`;
  }, [hasWeeklyAppointment, warningDate]);

  return {
    hasWeeklyAppointment,
    warningMessage,
    errorMessage,
  };
}
