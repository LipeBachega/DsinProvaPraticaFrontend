import type IResponse from "../types/response.type";
import type { IService } from "../types/service.type";
import { API_URL, ApiRequestError } from "./shared";

export async function getServicesRequest() {
  const response = await fetch(`${API_URL}/services`);

  const data = (await response.json()) as IResponse<IService[]>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel carregar os servicos.",
      data.error,
    );
  }

  return data;
}
