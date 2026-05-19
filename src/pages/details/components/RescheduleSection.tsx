import Button from "../../../components/button";
import SectionTitle from "../../../components/sectionTitle";
import TimeSlotButton from "../../../components/timeSlotButton.tsx";
import type { IAppointmentAvailabilitySlot } from "../../../types/appointment.type";

interface RescheduleSectionProps {
  selectedDate: string;
  selectedTime: string;
  todayInput: string;
  availableSlots: IAppointmentAvailabilitySlot[];
  isLoadingAvailability: boolean;
  isRescheduling: boolean;
  availabilityErrorMessage: string;
  onChangeDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onConfirmReschedule: () => void;
}

const RescheduleSection = ({
  selectedDate,
  selectedTime,
  todayInput,
  availableSlots,
  isLoadingAvailability,
  isRescheduling,
  availabilityErrorMessage,
  onChangeDate,
  onSelectTime,
  onConfirmReschedule,
}: RescheduleSectionProps) => {
  return (
    <div className="mt-6">
      <SectionTitle
        title="Reagendar"
        description="Escolha uma nova data e selecione um horario disponivel."
      />

      <input
        type="date"
        value={selectedDate}
        min={todayInput}
        onChange={(event) => onChangeDate(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
      />

      {isLoadingAvailability && (
        <p className="mt-4 text-sm text-slate-400">
          Buscando horarios disponiveis...
        </p>
      )}

      {!isLoadingAvailability && availabilityErrorMessage && (
        <p className="mt-4 text-sm text-rose-300">{availabilityErrorMessage}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {availableSlots.map((slot) => (
          <TimeSlotButton
            key={slot.startDateTime}
            time={slot.startTime}
            selected={selectedTime === slot.startTime}
            disabled={isLoadingAvailability || isRescheduling}
            onClick={() => onSelectTime(slot.startTime)}
          />
        ))}
      </div>

      {!!selectedDate &&
        !isLoadingAvailability &&
        !availabilityErrorMessage &&
        availableSlots.length === 0 && (
          <p className="mt-4 text-sm text-amber-400">
            Nenhum horario disponivel para a nova data escolhida.
          </p>
        )}

      <div className="mt-6">
        <Button
          title={isRescheduling ? "Reagendando..." : "Confirmar reagendamento"}
          disabled={!selectedTime || isRescheduling}
          onClick={onConfirmReschedule}
        />
      </div>
    </div>
  );
};

export default RescheduleSection;
