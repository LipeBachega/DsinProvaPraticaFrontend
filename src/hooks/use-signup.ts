import { useState } from "react";
import { signUpRequest } from "../api/customer";
import { ApiRequestError } from "../api/shared";
import type { ICustomerCreate } from "../types/customer.type";
import type { ApiFieldError } from "../api/shared";

function mapFieldErrors(details?: string | ApiFieldError[]) {
  // O backend devolve erros como lista; aqui transformamos em objeto por campo.
  if (!Array.isArray(details)) {
    return {};
  }

  return details.reduce<Record<string, string>>((accumulator, item) => {
    accumulator[item.field] = item.error;
    return accumulator;
  }, {});
}

export function useSignUp() {
  // O hook expõe tudo que a tela de cadastro precisa para responder à API.
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (payload: ICustomerCreate) => {
    // Resetamos mensagens antes de tentar um novo cadastro.
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await signUpRequest(payload);
      return response;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
        // Quando houver validação por campo, propagamos isso para os inputs.
        setFieldErrors(mapFieldErrors(error.details));
      } else {
        setErrorMessage("Nao foi possivel concluir o cadastro.");
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMessage,
    fieldErrors,
    submit,
  };
}
