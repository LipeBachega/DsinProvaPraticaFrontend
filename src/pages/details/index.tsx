import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointmentDetailRequest,
  updateAppointmentRequest,
  updateAppointmentStatusRequest,
} from "../../api/appointment";
import { ApiRequestError } from "../../api/shared";
import { useAvailability } from "../../hooks/use-availability";
import type {
  AppointmentStatus,
  IAppointmentDetail,
} from "../../types/appointment.type";
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
  const [appointment, setAppointment] = useState<IAppointmentDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const serviceIds = useMemo(() => {
    return appointment?.services.map((service) => service.id) ?? [];
  }, [appointment]);

  const {
    availableSlots,
    isLoading: isLoadingAvailability,
    errorMessage: availabilityErrorMessage,
    refetch: refetchAvailability,
  } = useAvailability(selectedDate, serviceIds, appointment?.id);

  const todayInput = getTodayInput();
  const currentUserRole = getCurrentUserRole();
  const isCustomerView = currentUserRole !== "ADMIN";

  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) {
        setErrorMessage("Agendamento não encontrado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAppointmentDetailRequest(Number(appointmentId));
        setAppointment(response.data ?? null);
      } catch (error) {
        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar os detalhes do agendamento.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadAppointment();
  }, [appointmentId]);

  const canReschedule = useMemo(() => {
    if (!appointment || !canManageAppointment(appointment)) {
      return false;
    }

    return canUserRescheduleAppointment(currentUserRole, appointment);
  }, [appointment, currentUserRole]);

  const selectedSlot = useMemo(() => {
    return availableSlots.find((slot) => slot.startTime === selectedTime) ?? null;
  }, [availableSlots, selectedTime]);

  const handleUpdateStatus = async (status: AppointmentStatus) => {
    if (!appointment) {
      return;
    }

    setIsUpdatingStatus(true);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await updateAppointmentStatusRequest(appointment.id, {
        status,
      });

      setAppointment((current) => (current ? { ...current, status } : current));
      setActionMessage(
        response.message || "Status do agendamento atualizado com sucesso.",
      );
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível atualizar o status do agendamento.");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!appointment || !selectedSlot) {
      return;
    }

    setIsRescheduling(true);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await updateAppointmentRequest(appointment.id, {
        startDate: selectedSlot.startDateTime,
        serviceIds,
      });

      const updatedAppointment = getUpdatedAppointment(response.data);

      if (!updatedAppointment) {
        setErrorMessage("Não foi possível carregar o agendamento atualizado.");
        return;
      }

      setAppointment(updatedAppointment);
      setSelectedTime("");
      refetchAvailability();
      setActionMessage(response.message || "Agendamento reagendado com sucesso.");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível reagendar o agendamento.");
      }
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    setErrorMessage("");
    setActionMessage("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setErrorMessage("");
    setActionMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <DetailsHeader onBack={() => navigate("/appointments")} />

        {isLoading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Carregando detalhes do agendamento...
            </p>
          </section>
        )}

        {!isLoading && errorMessage && !appointment && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-rose-300">{errorMessage}</p>
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
                onChangeDate={handleDateChange}
                onSelectTime={handleTimeSelect}
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
