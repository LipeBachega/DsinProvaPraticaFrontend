import { useState } from "react";
import { loginRequest } from "../api/login";
import { ApiRequestError } from "../api/shared";
import { saveToken } from "../utils/auth-storage";
import type { ILogin } from "../types/auth.type";

export function useLogin() {
  // Este hook isola todo o ciclo do login: loading, erro e persistência do token.
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (payload: ILogin) => {
    // A cada nova tentativa limpamos o erro anterior para não confundir o usuário.
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await loginRequest(payload);
      const token = response.data?.token;

      if (token) {
        // O token fica salvo para ser usado nas requests autenticadas seguintes.
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
      // O loading sempre precisa ser encerrado, com sucesso ou erro.
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMessage,
    submit,
  };
}
