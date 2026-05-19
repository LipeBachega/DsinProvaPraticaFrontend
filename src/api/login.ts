import type { ILogin, ILoginResponseData } from "../types/auth.type";
import type IResponse from "../types/response.type";
import { API_URL, ApiRequestError } from "./shared";

export async function loginRequest(payload: ILogin) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data: IResponse<ILoginResponseData> | null = null;

  try {
    data = (await response.json()) as IResponse<ILoginResponseData>;
  } catch {
    if (!response.ok) {
      throw new ApiRequestError("Não foi possível realizar o login.");
    }

    throw new ApiRequestError("Recebemos uma resposta inválida ao tentar entrar.");
  }

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Não foi possível realizar o login.",
      data.error,
    );
  }

  return data;
}
