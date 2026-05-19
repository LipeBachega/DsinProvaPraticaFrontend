import type { ICustomerCreate } from "../types/customer.type";
import type IResponse from "../types/response.type";
import { API_URL, ApiRequestError } from "./shared";

export async function signUpRequest(payload: ICustomerCreate) {
  const response = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as IResponse;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Não foi possível concluir o cadastro.",
      data.error,
    );
  }

  return data;
}
