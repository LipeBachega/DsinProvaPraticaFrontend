import { useState } from "react";
import { createAppointmentRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentCreateInput } from "../types/appointment.type";

export function useCreateAppointment() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setSuggestionMessage("");
  };

  const submit = async (payload: IAppointmentCreateInput) => {
    setIsLoading(true);
    clearMessages();

    try {
      const response = await createAppointmentRequest(payload);

      setSuccessMessage(response.message || "Agendamento realizado com sucesso.");
      setSuggestionMessage(response.data?.suggestion?.message ?? "");

      return response;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível concluir o agendamento.");
      }

      return null;
    } finally {
      setIsLoading(false);
    }
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
