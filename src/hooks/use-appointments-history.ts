import { useEffect, useState } from "react";
import { getAppointmentHistoryRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type {
  IAppointmentDetail,
  IAppointmentHistoryQuery,
} from "../types/appointment.type";
import { formatDateToInput } from "../utils/date";

function getDefaultPeriod(): IAppointmentHistoryQuery {
  const now = new Date();
  const startDate = new Date(now.getFullYear() - 1, 0, 1);
  const endDate = new Date(now.getFullYear() + 1, 11, 31);

  return {
    startDate: formatDateToInput(startDate),
    endDate: formatDateToInput(endDate),
  };
}

export function useAppointmentsHistory() {
  const [period, setPeriod] = useState<IAppointmentHistoryQuery>(getDefaultPeriod);
  const [appointments, setAppointments] = useState<IAppointmentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAppointmentHistoryRequest(period);
        setAppointments(response.data ?? []);
      } catch (error) {
        setAppointments([]);

        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Nao foi possivel carregar o historico de agendamentos.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [period]);

  return {
    period,
    setPeriod,
    appointments,
    isLoading,
    errorMessage,
  };
}
