import type { ILogin, ILoginResponseData } from "../types/auth.type";
import type { ICustomerCreate } from "../types/customer.type";
import type IResponse from "../types/response.type";
import type { IValidationError } from "../types/validation.type";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

type ApiFieldError = NonNullable<IValidationError["fields"]>[number];

export class ApiRequestError extends Error {
  details?: string | ApiFieldError[];

  constructor(message: string, details?: string | ApiFieldError[]) {
    super(message);
    this.name = "ApiRequestError";
    this.details = details;
  }
}

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
      data.message || "Nao foi possivel concluir o cadastro.",
      data.error,
    );
  }

  return data;
}
