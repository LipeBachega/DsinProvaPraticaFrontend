import SectionTitle from "../../../components/sectionTitle";
import TimeSlotButton from "../../../components/timeSlotButton.tsx";
import type { IAppointmentAvailabilitySlot } from "../../../types/appointment.type";

interface AvailabilitySectionProps {
  description: string;
  availableSlots: IAppointmentAvailabilitySlot[];
  selectedTime: string;
  selectedServicesCount: number;
  selectedDate: string;
  isLoadingAvailability: boolean;
  isCreatingAppointment: boolean;
  availabilityErrorMessage: string;
  weeklyAppointmentWarningMessage: string;
  weeklyAppointmentWarningError: string;
  hasWeeklyAppointment: boolean;
  onSelectTime: (time: string) => void;
}

const AvailabilitySection = ({
  description,
  availableSlots,
  selectedTime,
  selectedServicesCount,
  selectedDate,
  isLoadingAvailability,
  isCreatingAppointment,
  availabilityErrorMessage,
  weeklyAppointmentWarningMessage,
  weeklyAppointmentWarningError,
  hasWeeklyAppointment,
  onSelectTime,
}: AvailabilitySectionProps) => {
  return (
    <div className="mt-10">
      {/* Aqui concentramos estados visuais da consulta de disponibilidade. */}
      <SectionTitle title="3. Horarios vagos" description={description} />

      {isLoadingAvailability && (
        <p className="mt-4 text-sm text-slate-400">
          Buscando horarios disponiveis...
        </p>
      )}

      {!isLoadingAvailability && availabilityErrorMessage && (
        <p className="mt-4 text-sm text-rose-300">{availabilityErrorMessage}</p>
      )}

      {!isLoadingAvailability &&
        !availabilityErrorMessage &&
        hasWeeklyAppointment &&
        weeklyAppointmentWarningMessage && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {weeklyAppointmentWarningMessage}
          </div>
        )}

      {!isLoadingAvailability &&
        !availabilityErrorMessage &&
        weeklyAppointmentWarningError && (
          <p className="mt-4 text-sm text-rose-300">
            {weeklyAppointmentWarningError}
          </p>
        )}

      <div className="mt-4 flex flex-wrap gap-3">
        {/* Cada slot já vem validado pelo backend com duração e conflito considerados. */}
        {availableSlots.map((slot) => (
          <TimeSlotButton
            key={slot.startDateTime}
            time={slot.startTime}
            selected={selectedTime === slot.startTime}
            disabled={
              selectedServicesCount === 0 ||
              !selectedDate ||
              isLoadingAvailability ||
              isCreatingAppointment
            }
            onClick={() => onSelectTime(slot.startTime)}
          />
        ))}
      </div>

      {selectedServicesCount > 0 &&
        selectedDate &&
        !isLoadingAvailability &&
        !availabilityErrorMessage &&
        availableSlots.length === 0 && (
          <p className="mt-4 text-sm text-amber-400">
            Nenhum horario vago encontrado para este dia.
          </p>
        )}
    </div>
  );
};

export default AvailabilitySection;
