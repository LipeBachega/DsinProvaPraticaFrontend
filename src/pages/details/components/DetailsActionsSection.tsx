import SectionTitle from "../../../components/sectionTitle";
import type {
  AppointmentStatus,
  IAppointmentAvailabilitySlot,
  IAppointmentDetail,
} from "../../../types/appointment.type";
import RescheduleSection from "./RescheduleSection";
import StatusManagementSection from "./StatusManagementSection";

interface DetailsActionsSectionProps {
  appointment: IAppointmentDetail;
  isCustomerView: boolean;
  canManageAppointment: boolean;
  canReschedule: boolean;
  errorMessage: string;
  actionMessage: string;
  isUpdatingStatus: boolean;
  isRescheduling: boolean;
  selectedDate: string;
  selectedTime: string;
  todayInput: string;
  availableSlots: IAppointmentAvailabilitySlot[];
  isLoadingAvailability: boolean;
  availabilityErrorMessage: string;
  onUpdateStatus: (status: AppointmentStatus) => void;
  onChangeDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onConfirmReschedule: () => void;
}

const DetailsActionsSection = ({
  appointment,
  isCustomerView,
  canManageAppointment,
  canReschedule,
  errorMessage,
  actionMessage,
  isUpdatingStatus,
  isRescheduling,
  selectedDate,
  selectedTime,
  todayInput,
  availableSlots,
  isLoadingAvailability,
  availabilityErrorMessage,
  onUpdateStatus,
  onChangeDate,
  onSelectTime,
  onConfirmReschedule,
}: DetailsActionsSectionProps) => {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionTitle
        title="Ações"
        description="Gerencie este agendamento sem sair da tela de detalhes."
      />

      {actionMessage && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {actionMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {errorMessage}
        </div>
      )}

      {!isCustomerView && canManageAppointment && (
        <StatusManagementSection
          appointment={appointment}
          isUpdatingStatus={isUpdatingStatus}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {isCustomerView && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Cancelamentos devem ser feitos por telefone. Alterações com menos de 2
          dias de antecedência também precisam ser feitas por telefone.
        </div>
      )}

      {!canManageAppointment && (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
          Este agendamento não permite novas alterações porque já foi finalizado
          ou cancelado.
        </div>
      )}

      {canManageAppointment && !canReschedule && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Este agendamento só pode ser alterado por telefone neste momento,
          conforme a regra do desafio.
        </div>
      )}

      {canManageAppointment && canReschedule && (
        <RescheduleSection
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          todayInput={todayInput}
          availableSlots={availableSlots}
          isLoadingAvailability={isLoadingAvailability}
          isRescheduling={isRescheduling}
          availabilityErrorMessage={availabilityErrorMessage}
          onChangeDate={onChangeDate}
          onSelectTime={onSelectTime}
          onConfirmReschedule={onConfirmReschedule}
        />
      )}
    </aside>
  );
};

export default DetailsActionsSection;
