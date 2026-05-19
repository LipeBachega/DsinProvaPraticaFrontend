import { useCallback, useEffect, useMemo, useState } from "react";
import { getAvailabilityRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentAvailabilitySlot } from "../types/appointment.type";

// os dados de disponibilidade dependem da data selecionada, dos serviços selecionados e do id do agendamento (no caso de edição, para excluir os horários já agendados).
export function useAvailability(
  selectedDate: string,
  serviceIds: number[],
  appointmentId?: number,
) {
  // O estado local guarda a lista de horários e guarda a mensagem de erro se a API reclamar
  const [availableSlots, setAvailableSlots] = useState<
    IAppointmentAvailabilitySlot[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // a chave é usada para evitar que a consulta seja feita sempre que o serviço é alterado.
  const serviceIdsKey = useMemo(() => serviceIds.join(","), [serviceIds]);

  const fetchAvailability = useCallback(async () => {
    // Se o cliente não selecionar nenhum serviço, não fazemos consulta.
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
      // caso o backend retorne um erro, armazenamos a mensagem de erro.
      // a ideia é mostrar essa mensagem para o cliente, para que ele entenda o que aconteceu.
      // usamos nossa própria classe de erro extendida para acessar as mensagens de erro e nao precisamos
      // de um catch global.
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível consultar os horários disponíveis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId, selectedDate, serviceIdsKey]);


  // aqui é onde a consulta é feita, e o estado é atualizado.
  // uma sacada foi entender que array é recriado sempre que renderizar o pai
  // comparar com uma string única evita chamadas desnecessárias.
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
