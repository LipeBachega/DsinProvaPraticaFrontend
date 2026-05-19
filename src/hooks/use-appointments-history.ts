import { useEffect, useState } from "react";
import { getAppointmentHistoryRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type {
  IAppointmentDetail,
  IAppointmentHistoryQuery,
} from "../types/appointment.type";
import { formatDateToInput } from "../utils/date";

function getDefaultPeriod(): IAppointmentHistoryQuery {
  // Abrimos o histórico com uma janela grande para evitar que a tela nasça vazia.
  const now = new Date();
  const startDate = new Date(now.getFullYear() - 1, 0, 1);
  const endDate = new Date(now.getFullYear() + 1, 11, 31);

  return {
    startDate: formatDateToInput(startDate),
    endDate: formatDateToInput(endDate),
    search: "",
  };
}

export function useAppointmentsHistory() {
  // A página de histórico depende de período, lista, loading e erro.
  const [period, setPeriod] = useState<IAppointmentHistoryQuery>(getDefaultPeriod);
  const [appointments, setAppointments] = useState<IAppointmentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (period.startDate > period.endDate) {
      setAppointments([]);
      setIsLoading(false);
      setErrorMessage("A data inicial nao pode ser maior que a data final.");
      return;
    }

    async function loadHistory() {
      // Cada mudança no período dispara uma nova leitura no backend.
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
