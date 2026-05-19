import type { IValidationError } from "../types/validation.type";

// Todas as APIs usam a mesma base URL; em produção ela pode vir do `.env`.
export const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "/api" : "http://localhost:3333");

export type ApiFieldError = NonNullable<IValidationError["fields"]>[number];

export class ApiRequestError extends Error {
  details?: string | ApiFieldError[];

  constructor(message: string, details?: string | ApiFieldError[]) {
    super(message);
    // Preservamos detalhes do backend para permitir mensagens por campo no front.
    this.name = "ApiRequestError";
    this.details = details;
  }
}
