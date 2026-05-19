import { useState } from "react";
import { loginRequest } from "../api/login";
import { ApiRequestError } from "../api/shared";
import { saveToken } from "../utils/auth-storage";
import type { ILogin } from "../types/auth.type";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (payload: ILogin) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await loginRequest(payload);
      const token = response.data?.token;

      if (token) {
        saveToken(token);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Nao foi possivel realizar o login.");
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMessage,
    submit,
  };
}
