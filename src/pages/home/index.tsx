import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailability } from "../../hooks/use-availability";
import { useCreateAppointment } from "../../hooks/use-create-appointment";
import { useServices } from "../../hooks/use-services";
import { useWeeklyAppointmentWarning } from "../../hooks/use-weekly-appointment-warning";
import { formatCurrency } from "../../utils/currency";
import AppointmentSummary from "./components/AppointmentSummary";
import AvailabilitySection from "./components/AvailabilitySection";
import DateSelection from "./components/DateSelection";
import HomeHeader from "./components/HomeHeader";
import ServiceSelection from "./components/ServiceSelection";

const Home = () => {
  const navigate = useNavigate();

  const {
    services,
    isLoading: isLoadingServices,
    errorMessage: servicesErrorMessage,
  } = useServices();

  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedTime, setSelectedTime] = useState("");

  const {
    availableSlots,
    isLoading: isLoadingAvailability,
    errorMessage: availabilityErrorMessage,
    refetch: refetchAvailability,
  } = useAvailability(selectedDate, selectedServices);

  const {
    hasWeeklyAppointment,
    warningMessage: weeklyAppointmentWarningMessage,
    errorMessage: weeklyAppointmentWarningError,
  } = useWeeklyAppointmentWarning(selectedDate, selectedServices);

  const {
    isLoading: isCreatingAppointment,
    errorMessage: createAppointmentErrorMessage,
    successMessage: createAppointmentSuccessMessage,
    suggestionMessage,
    submit: createAppointment,
    clearMessages,
  } = useCreateAppointment();

  const selectedServiceDetails = services.filter((service) =>
    selectedServices.includes(service.id),
  );

  const totalDuration = useMemo(() => {
    return selectedServiceDetails.reduce(
      (total, service) => total + service.estimatedTimeInMinutes,
      0,
    );
  }, [selectedServiceDetails]);

  const totalPrice = useMemo(() => {
    return selectedServiceDetails.reduce(
      (total, service) => total + service.price,
      0,
    );
  }, [selectedServiceDetails]);

  const toggleService = (serviceId: number) => {
    setSelectedTime("");

    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    clearMessages();
  };

  const handleCreateAppointment = async () => {
    const selectedSlot = availableSlots.find(
      (slot) => slot.startTime === selectedTime,
    );

    if (!selectedSlot) {
      return;
    }

    const response = await createAppointment({
      startDate: selectedSlot.startDateTime,
      serviceIds: selectedServices,
    });

    if (response?.success) {
      setSelectedTime("");
      refetchAvailability();
    }
  };

  const availabilityDescription =
    selectedServices.length === 0
      ? "Escolha ao menos um servico para liberar a busca de horarios."
      : !selectedDate
        ? "Selecione um dia para ver os horarios disponiveis."
        : "Escolha um horario livre para finalizar o agendamento.";

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white select-none">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <HomeHeader
          onViewAppointments={() => navigate("/appointments")}
          onLogout={() => navigate("/login")}
        />

        <div className="grid grid-cols-[1.4fr_0.8fr] gap-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <ServiceSelection
              services={services}
              selectedServices={selectedServices}
              isLoading={isLoadingServices}
              errorMessage={servicesErrorMessage}
              formatPrice={formatCurrency}
              onToggleService={(serviceId) => {
                clearMessages();
                toggleService(serviceId);
              }}
            />

            <DateSelection
              selectedDate={selectedDate}
              onChangeDate={handleDateChange}
            />

            <AvailabilitySection
              description={availabilityDescription}
              availableSlots={availableSlots}
              selectedTime={selectedTime}
              selectedServicesCount={selectedServices.length}
              selectedDate={selectedDate}
              isLoadingAvailability={isLoadingAvailability}
              isCreatingAppointment={isCreatingAppointment}
              availabilityErrorMessage={availabilityErrorMessage}
              weeklyAppointmentWarningMessage={weeklyAppointmentWarningMessage}
              weeklyAppointmentWarningError={weeklyAppointmentWarningError}
              hasWeeklyAppointment={hasWeeklyAppointment}
              onSelectTime={(time) => {
                clearMessages();
                setSelectedTime(time);
              }}
            />
          </section>

          <AppointmentSummary
            selectedServiceDetails={selectedServiceDetails}
            totalDuration={totalDuration}
            totalPrice={totalPrice}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            isCreatingAppointment={isCreatingAppointment}
            createAppointmentErrorMessage={createAppointmentErrorMessage}
            createAppointmentSuccessMessage={createAppointmentSuccessMessage}
            suggestionMessage={suggestionMessage}
            formatPrice={formatCurrency}
            onConfirmAppointment={handleCreateAppointment}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
