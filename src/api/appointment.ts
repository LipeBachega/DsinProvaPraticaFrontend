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
  // Todas as rotas de agendamento exigem token, então centralizamos esse cabeçalho.
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAvailabilityRequest(
  query: IAppointmentAvailabilityQuery,
) {
  // A disponibilidade depende da data escolhida e da combinação de serviços.
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
  // Cria o agendamento final usando o horário já validado pela disponibilidade.
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
  // O histórico é filtrado por período para alimentar a página "Meus agendamentos".
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
  // Mantido para evoluções futuras, como detalhe individual do agendamento.
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
  // Também fica preparado para futura edição de horários/serviços.
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
  // Fluxo pensado para administração quando status entrar no front.
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
