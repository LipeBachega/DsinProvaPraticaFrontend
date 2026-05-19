import { useEffect, useState } from "react";
import { getAppointmentHistoryRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type {
  IAppointmentDetail,
  IAppointmentHistoryQuery,
} from "../types/appointment.type";

const defaultPeriod: IAppointmentHistoryQuery = {
  startDate: "2025-01-01",
  endDate: "2027-12-31",
  search: "",
};

export function useAppointmentsHistory() {
  const [period, setPeriod] = useState<IAppointmentHistoryQuery>(defaultPeriod);
  const [appointments, setAppointments] = useState<IAppointmentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (period.startDate > period.endDate) {
        setAppointments([]);
        setErrorMessage("A data inicial não pode ser maior que a data final.");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAppointmentHistoryRequest(period);
        setAppointments(response.data ?? []);
      } catch (error) {
        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar o histórico de agendamentos.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadHistory();
  }, [period]);

  return {
    period,
    setPeriod,
    appointments,
    isLoading,
    errorMessage,
  };
}
