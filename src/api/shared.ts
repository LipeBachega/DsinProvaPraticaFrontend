import type { IValidationError } from "../types/validation.type";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export type ApiFieldError = NonNullable<IValidationError["fields"]>[number];

export class ApiRequestError extends Error {
  details?: string | ApiFieldError[];

  constructor(message: string, details?: string | ApiFieldError[]) {
    super(message);
    this.name = "ApiRequestError";
    this.details = details;
  }
}
