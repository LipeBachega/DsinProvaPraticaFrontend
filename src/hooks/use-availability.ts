import { useEffect, useState } from "react";
import { getAvailabilityRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentAvailabilitySlot } from "../types/appointment.type";

export function useAvailability(selectedDate: string, serviceIds: number[]) {
  // Este hook vive em função de dois filtros: data escolhida e serviços selecionados.
  const [availableSlots, setAvailableSlots] = useState<IAppointmentAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadAvailability() {
      // Sem data ou sem serviço não existe consulta válida de disponibilidade.
      if (!selectedDate || serviceIds.length === 0) {
        setAvailableSlots([]);
        setErrorMessage("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAvailabilityRequest({
          date: selectedDate,
          serviceIds,
        });

        setAvailableSlots(response.data?.availableSlots ?? []);
      } catch (error) {
        setAvailableSlots([]);

        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Nao foi possivel consultar os horarios disponiveis.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    // O refetch manual é usado após criar agendamento, mesmo sem trocar filtros.
    loadAvailability();
  }, [selectedDate, serviceIds, reloadKey]);

  const refetch = () => {
    // Incrementar a chave força uma nova execução do efeito.
    setReloadKey((current) => current + 1);
  };

  return {
    availableSlots,
    isLoading,
    errorMessage,
    refetch,
  };
}
