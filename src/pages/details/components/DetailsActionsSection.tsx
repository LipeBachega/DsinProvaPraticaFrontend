import SectionTitle from "../../../components/sectionTitle";
import type { AppointmentStatus, IAppointmentAvailabilitySlot, IAppointmentDetail } from "../../../types/appointment.type";
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
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionTitle
        title="Acoes"
        description="Gerencie este agendamento sem sair da tela de detalhes."
      />

      {errorMessage && (
        <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {errorMessage}
        </p>
      )}

      {actionMessage && (
        <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {actionMessage}
        </p>
      )}

      {!isCustomerView && (
        <StatusManagementSection
          appointment={appointment}
          isUpdatingStatus={isUpdatingStatus}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      {isCustomerView && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
          Cancelamentos so podem ser feitos por telefone. Alteracoes de data com
          menos de 2 dias de antecedencia tambem devem ser solicitadas por
          telefone.
        </div>
      )}

      {!canManageAppointment && (
        <p className="mt-4 text-sm text-slate-400">
          Este agendamento nao permite novas alteracoes porque ja foi finalizado
          ou cancelado.
        </p>
      )}

      {canManageAppointment && !canReschedule && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
          Alteracoes com menos de 2 dias de antecedencia devem ser feitas por
          telefone, conforme a regra do desafio.
        </div>
      )}

      {canReschedule && (
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
    </section>
  );
};

export default DetailsActionsSection;
