import { getToken } from "../utils/auth-storage";
import type {
  IAppointmentAvailabilityQuery,
  IAppointmentAvailabilityResponse,
  IAppointmentCreateInput,
  IAppointmentDetail,
  IAppointmentHistoryQuery,
  IAppointmentResponseData,
  IAppointmentStatusUpdateInput,
  IAppointmentUpdateInput,
} from "../types/appointment.type";
import type IResponse from "../types/response.type";
import { API_URL, ApiRequestError } from "./shared";

function createAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAvailabilityRequest(
  query: IAppointmentAvailabilityQuery,
) {
  const params = new URLSearchParams({
    date: query.date,
    serviceIds: query.serviceIds.join(","),
  });

  const response = await fetch(`${API_URL}/appointments/availability?${params}`, {
    headers: createAuthHeaders(),
  });

  const data = (await response.json()) as IResponse<IAppointmentAvailabilityResponse>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel consultar a disponibilidade.",
      data.error,
    );
  }

  return data;
}

export async function createAppointmentRequest(payload: IAppointmentCreateInput) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as IResponse<IAppointmentResponseData>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel criar o agendamento.",
      data.error,
    );
  }

  return data;
}

export async function getAppointmentHistoryRequest(
  query: IAppointmentHistoryQuery,
) {
  const params = new URLSearchParams(query);

  const response = await fetch(`${API_URL}/appointments/history?${params}`, {
    headers: createAuthHeaders(),
  });

  const data = (await response.json()) as IResponse<IAppointmentDetail[]>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel listar o historico de agendamentos.",
      data.error,
    );
  }

  return data;
}

export async function getAppointmentDetailRequest(id: number) {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    headers: createAuthHeaders(),
  });

  const data = (await response.json()) as IResponse;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel buscar o agendamento.",
      data.error,
    );
  }

  return data;
}

export async function updateAppointmentRequest(
  id: number,
  payload: IAppointmentUpdateInput,
) {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: "PUT",
    headers: createAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as IResponse<IAppointmentResponseData>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel atualizar o agendamento.",
      data.error,
    );
  }

  return data;
}

export async function updateAppointmentStatusRequest(
  id: number,
  payload: IAppointmentStatusUpdateInput,
) {
  const response = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: createAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as IResponse<IAppointmentResponseData>;

  if (!response.ok || !data.success) {
    throw new ApiRequestError(
      data.message || "Nao foi possivel atualizar o status do agendamento.",
      data.error,
    );
  }

  return data;
}
