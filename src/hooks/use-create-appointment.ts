import { useState } from "react";
import { createAppointmentRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentCreateInput } from "../types/appointment.type";

export function useCreateAppointment() {
  // Centraliza o estado do envio final do agendamento.
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");

  const submit = async (payload: IAppointmentCreateInput) => {
    // Sempre começamos uma tentativa limpando mensagens de tentativas anteriores.
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setSuggestionMessage("");

    try {
      const response = await createAppointmentRequest(payload);

      // A resposta de sucesso pode trazer mensagem principal e uma sugestão extra do backend.
      setSuccessMessage(response.message);
      setSuggestionMessage(response.data?.suggestion?.message ?? "");

      return response;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Nao foi possivel concluir o agendamento.");
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    // A home usa isso sempre que o usuário altera decisões importantes do fluxo.
    setErrorMessage("");
    setSuccessMessage("");
    setSuggestionMessage("");
  };

  return {
    isLoading,
    errorMessage,
    successMessage,
    suggestionMessage,
    submit,
    clearMessages,
  };
}
