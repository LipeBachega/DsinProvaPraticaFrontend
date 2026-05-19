import { useState } from "react";
import { createAppointmentRequest } from "../api/appointment";
import { ApiRequestError } from "../api/shared";
import type { IAppointmentCreateInput } from "../types/appointment.type";

export function useCreateAppointment() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");

  const submit = async (payload: IAppointmentCreateInput) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setSuggestionMessage("");

    try {
      const response = await createAppointmentRequest(payload);

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
