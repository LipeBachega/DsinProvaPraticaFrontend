import type { IUserRole } from "../../types/customer.type";
import type {
  AppointmentStatus,
  IAppointmentDetail,
  IAppointmentResponseData,
} from "../../types/appointment.type";
import { getCurrentUserRole } from "../../utils/auth";
import { formatDateToInput } from "../../utils/date";

export function getAppointmentTotal(appointment: IAppointmentDetail) {
  return appointment.services.reduce(
    (total, service) => total + service.price,
    0,
  );
}

export function getTotalDuration(appointment: IAppointmentDetail) {
  return appointment.services.reduce(
    (total, service) => total + service.estimatedTimeInMinutes,
    0,
  );
}

export function getTodayInput() {
  return formatDateToInput(new Date());
}

export function canChangeAppointmentThroughSystem(date: string | Date) {
  const diffInMs = new Date(date).getTime() - new Date().getTime();
  const twoDaysInMs = 1000 * 60 * 60 * 24 * 2;
  return diffInMs >= twoDaysInMs;
}

export function canUserRescheduleAppointment(
  role: IUserRole | null,
  appointment: IAppointmentDetail,
) {
  if (role === "ADMIN") {
    return true;
  }

  return canChangeAppointmentThroughSystem(appointment.startDate);
}

export function canManageAppointment(appointment: IAppointmentDetail) {
  return (
    appointment.status !== "CANCELADO" && appointment.status !== "CONCLUIDO"
  );
}

export { getCurrentUserRole };

export function getUpdatedAppointment(
  data?: IAppointmentResponseData | IAppointmentDetail,
) {
  if (!data) {
    return undefined;
  }

  if ("appointment" in data && data.appointment) {
    return data.appointment;
  }

  if ("id" in data) {
    return data;
  }

  return undefined;
}

export const statusButtonMap: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  PENDENTE: {
    label: "Marcar como pendente",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20",
  },
  CONFIRMADO: {
    label: "Confirmar",
    className:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20",
  },
  CONCLUIDO: {
    label: "Concluir",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20",
  },
  CANCELADO: {
    label: "Cancelar",
    className:
      "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20",
  },
};
