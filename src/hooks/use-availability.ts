import { useCallback, useEffect, useMemo, useState } from "react";
import { getAvailabilityRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentAvailabilitySlot } from "../types/appointment.type";

export function useAvailability(
  selectedDate: string,
  serviceIds: number[],
  appointmentId?: number,
) {
  const [availableSlots, setAvailableSlots] = useState<IAppointmentAvailabilitySlot[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const serviceIdsKey = useMemo(() => serviceIds.join(","), [serviceIds]);

  const fetchAvailability = useCallback(async () => {
    if (!selectedDate || serviceIds.length === 0) {
      setAvailableSlots([]);
      setErrorMessage("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getAvailabilityRequest({
        date: selectedDate,
        serviceIds,
        appointmentId,
      });

      setAvailableSlots(response.data?.availableSlots ?? []);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível consultar os horários disponíveis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId, selectedDate, serviceIds]);

  useEffect(() => {
    void fetchAvailability();
  }, [fetchAvailability, serviceIdsKey]);

  return {
    availableSlots,
    isLoading,
    errorMessage,
    refetch: fetchAvailability,
  };
}
