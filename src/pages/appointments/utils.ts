import { getToken } from "../../utils/auth-storage";
import type {
  AppointmentStatus,
  IAppointmentDetail,
} from "../../types/appointment.type";
import type { IUserRole } from "../../types/customer.type";

export type AppointmentFilter = "TODOS" | AppointmentStatus;

export const appointmentFilters: AppointmentFilter[] = [
  "TODOS",
  "PENDENTE",
  "CONFIRMADO",
  "CANCELADO",
  "CONCLUIDO",
];

export const statusLabelMap: Record<AppointmentStatus, string> = {
  PENDENTE: "Pendentes",
  CONFIRMADO: "Confirmados",
  CANCELADO: "Cancelados",
  CONCLUIDO: "Concluidos",
};

export const statusClassMap: Record<AppointmentStatus, string> = {
  PENDENTE: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  CONFIRMADO: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  CANCELADO: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  CONCLUIDO: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

export function getCurrentUserRole(): IUserRole | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as { role?: IUserRole };

    return parsedPayload.role ?? null;
  } catch {
    return null;
  }
}

export function getAppointmentTotal(appointment: IAppointmentDetail) {
  return appointment.services.reduce(
    (total, service) => total + service.price,
    0,
  );
}

export function getStatusCount(
  appointments: IAppointmentDetail[],
  status: AppointmentStatus,
) {
  return appointments.filter((appointment) => appointment.status === status)
    .length;
}
