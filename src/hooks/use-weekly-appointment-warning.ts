import { useEffect, useMemo, useState } from "react";
import { getAppointmentHistoryRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentDetail } from "../types/appointment.type";
import { formatDateTime, getWeekRangeFromDate } from "../utils/date";

export function useWeeklyAppointmentWarning(
  selectedDate: string,
  selectedServiceIds: number[],
) {
  const [appointments, setAppointments] = useState<IAppointmentDetail[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadWeekAppointments() {
      if (!selectedDate || selectedServiceIds.length === 0) {
        setAppointments([]);
        setErrorMessage("");
        return;
      }

      try {
        const period = getWeekRangeFromDate(selectedDate);
        const response = await getAppointmentHistoryRequest(period);
        setAppointments(response.data ?? []);
      } catch (error) {
        setAppointments([]);

        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Nao foi possivel verificar agendamentos da mesma semana.");
        }
      }
    }

    loadWeekAppointments();
  }, [selectedDate, selectedServiceIds]);

  const warningMessage = useMemo(() => {
    if (!selectedDate || appointments.length === 0) {
      return "";
    }

    const firstAppointment = appointments[0];
    const formattedDate = formatDateTime(firstAppointment.startDate);

    return `Voce ja possui um agendamento nesta semana em ${formattedDate}.`;
  }, [appointments, selectedDate]);

  return {
    hasWeeklyAppointment: appointments.length > 0,
    warningMessage,
    errorMessage,
  };
}
