import { useState } from "react";
import { loginRequest } from "../api/login";
import { ApiRequestError } from "../api/shared";
import type { ILogin } from "../types/auth.type";
import { saveToken } from "../utils/auth-storage";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (payload: ILogin) => {
    setIsLoading(true);
    setErrorMessage("");

    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedPassword = payload.password;

    if (!normalizedEmail || !normalizedPassword) {
      setErrorMessage("Preencha e-mail e senha para continuar.");
      setIsLoading(false);
      return null;
    }

    try {
      const response = await loginRequest({
        email: normalizedEmail,
        password: normalizedPassword,
      });

      if (!response.data?.token) {
        setErrorMessage("O login foi concluido sem token de autenticacao.");
        return null;
      }

      saveToken(response.data.token);
      return response;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else if (error instanceof TypeError) {
        setErrorMessage(
          "Nao foi possivel conectar ao servidor. Verifique se o backend esta em execucao.",
        );
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
