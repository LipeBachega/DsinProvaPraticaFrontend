import { useEffect, useState } from "react";
import { getAppointmentDetailRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentDetail } from "../types/appointment.type";

export function useAppointmentDetail(appointmentId: string | undefined) {
  const [appointment, setAppointment] = useState<IAppointmentDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) {
        setErrorMessage("Agendamento não encontrado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAppointmentDetailRequest(
          Number(appointmentId),
        );
        setAppointment(response.data ?? null);
      } catch (error) {
        if (error instanceof ApiRequestError || error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            "Não foi possível carregar os detalhes do agendamento.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadAppointment();
  }, [appointmentId]);

  return {
    appointment,
    setAppointment,
    isLoading,
    errorMessage,
  };
}
