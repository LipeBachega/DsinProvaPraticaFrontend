import SectionTitle from "../../../components/sectionTitle";
import type {
  AppointmentStatus,
  IAppointmentDetail,
} from "../../../types/appointment.type";
import { statusButtonMap } from "../utils";

interface StatusManagementSectionProps {
  appointment: IAppointmentDetail;
  isUpdatingStatus: boolean;
  onUpdateStatus: (status: AppointmentStatus) => void;
}

const StatusManagementSection = ({
  appointment,
  isUpdatingStatus,
  onUpdateStatus,
}: StatusManagementSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      <SectionTitle
        title="Status do agendamento"
        description="Atualize rapidamente o andamento do atendimento."
      />

      <div className="grid grid-cols-2 gap-3">
        {(
          [
            "PENDENTE",
            "CONFIRMADO",
            "CONCLUIDO",
            "CANCELADO",
          ] as AppointmentStatus[]
        ).map((status) => {
          const isActive = appointment.status === status;
          const buttonConfig = statusButtonMap[status];

          return (
            <button
              key={status}
              type="button"
              onClick={() => onUpdateStatus(status)}
              disabled={isUpdatingStatus || isActive}
              className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive
                  ? "border-white/20 bg-white text-slate-950"
                  : buttonConfig.className
              }`}
            >
              {isUpdatingStatus && !isActive
                ? "Atualizando..."
                : buttonConfig.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusManagementSection;
