import { useState } from "react";
import { signUpRequest } from "../api/customer";
import { ApiRequestError } from "../api/shared";
import type { ICustomerCreate } from "../types/customer.type";
import type { ApiFieldError } from "../api/shared";

function mapFieldErrors(details?: string | ApiFieldError[]) {
  if (!Array.isArray(details)) {
    return {};
  }

  return details.reduce<Record<string, string>>((accumulator, item) => {
    accumulator[item.field] = item.error;
    return accumulator;
  }, {});
}

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (payload: ICustomerCreate) => {
    setIsLoading(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await signUpRequest(payload);
      return response;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
        setFieldErrors(mapFieldErrors(error.details));
      } else {
        setErrorMessage("Não foi possível concluir o cadastro.");
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
