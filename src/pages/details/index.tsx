import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateAppointmentRequest,
  updateAppointmentStatusRequest,
} from "../../api/appointment";
import { useAvailability } from "../../hooks/use-availability";
import { useAppointmentDetail } from "../../hooks/use-appointment-detail";
import type { AppointmentStatus } from "../../types/appointment.type";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime, formatHour } from "../../utils/date";
import AppointmentOverview from "./components/AppointmentOverview";
import AppointmentServicesSection from "./components/AppointmentServicesSection";
import DetailsActionsSection from "./components/DetailsActionsSection";
import DetailsHeader from "./components/DetailsHeader";
import {
  canManageAppointment,
  canUserRescheduleAppointment,
  getAppointmentTotal,
  getCurrentUserRole,
  getTodayInput,
  getTotalDuration,
  getUpdatedAppointment,
} from "./utils";

const AppointmentDetails = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  // Consumindo o Hook que isola a lógica de Fetch
  const { appointment, setAppointment, isLoading, errorMessage } =
    useAppointmentDetail(appointmentId);

  // Estados locais para a interação na tela
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const currentUserRole = getCurrentUserRole();
  const isCustomerView = currentUserRole !== "ADMIN";
  const todayInput = getTodayInput();

  const serviceIds = useMemo(
    () => appointment?.services.map((s) => s.id) ?? [],
    [appointment],
  );

  const {
    availableSlots,
    isLoading: isLoadingAvailability,
    errorMessage: availabilityErrorMessage,
    refetch: refetchAvailability,
  } = useAvailability(selectedDate, serviceIds, appointment?.id);

  const canReschedule = useMemo(() => {
    if (!appointment || !canManageAppointment(appointment)) return false;
    return canUserRescheduleAppointment(currentUserRole, appointment);
  }, [appointment, currentUserRole]);

  const selectedSlot = useMemo(() => {
    return (
      availableSlots.find((slot) => slot.startTime === selectedTime) ?? null
    );
  }, [availableSlots, selectedTime]);

  const handleUpdateStatus = async (status: AppointmentStatus) => {
    if (!appointment) return;
    setIsUpdatingStatus(true);
    try {
      const response = await updateAppointmentStatusRequest(appointment.id, {
        status,
      });
      setAppointment((current) => (current ? { ...current, status } : current));
      setActionMessage(response.message || "Status atualizado com sucesso.");
    } catch (error) {
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!appointment || !selectedSlot) return;
    setIsRescheduling(true);
    try {
      const response = await updateAppointmentRequest(appointment.id, {
        startDate: selectedSlot.startDateTime,
        serviceIds,
      });
      const updated = getUpdatedAppointment(response.data);
      if (updated) {
        setAppointment(updated);
        setSelectedTime("");
        refetchAvailability();
        setActionMessage(response.message || "Reagendado com sucesso.");
      }
    } catch (error) {
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <DetailsHeader onBack={() => navigate("/appointments")} />
        {isLoading && (
          <section className="p-6 border border-slate-800 bg-slate-900 rounded-2xl">
            Carregando...
          </section>
        )}
        {!isLoading && appointment && (
          <>
            <AppointmentOverview
              appointment={appointment}
              formatDateTime={formatDateTime}
              formatHour={formatHour}
              formatPrice={formatCurrency}
              getAppointmentTotal={getAppointmentTotal}
              isCustomerView={isCustomerView}
            />
            <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
              <AppointmentServicesSection
                appointment={appointment}
                formatPrice={formatCurrency}
                getTotalDuration={getTotalDuration}
              />
              <DetailsActionsSection
                appointment={appointment}
                isCustomerView={isCustomerView}
                canManageAppointment={canManageAppointment(appointment)}
                canReschedule={canReschedule}
                errorMessage={errorMessage}
                actionMessage={actionMessage}
                isUpdatingStatus={isUpdatingStatus}
                isRescheduling={isRescheduling}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                todayInput={todayInput}
                availableSlots={availableSlots}
                isLoadingAvailability={isLoadingAvailability}
                availabilityErrorMessage={availabilityErrorMessage}
                onUpdateStatus={handleUpdateStatus}
                onChangeDate={(d) => setSelectedDate(d)}
                onSelectTime={(t) => setSelectedTime(t)}
                onConfirmReschedule={handleRescheduleAppointment}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
