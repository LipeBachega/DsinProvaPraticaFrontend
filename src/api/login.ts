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

  const data = (await response.json()) as IResponse<ILoginResponseData>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel realizar o login.",
      data.error,
    );
  }

  return data;
}
