import { useEffect, useState } from "react";
import { getAvailabilityRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentAvailabilitySlot } from "../types/appointment.type";

export function useAvailability(selectedDate: string, serviceIds: number[]) {
  const [availableSlots, setAvailableSlots] = useState<IAppointmentAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAvailability() {
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

    loadAvailability();
  }, [selectedDate, serviceIds]);

  return {
    availableSlots,
    isLoading,
    errorMessage,
  };
}
