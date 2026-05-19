import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/sectionTitle";
import ServiceCard from "../../components/serviceCard";
import SummaryCard from "../../components/summaryCard";
import TimeSlotButton from "../../components/timeSlotButton.tsx";
import { useAvailability } from "../../hooks/use-availability";
import { useCreateAppointment } from "../../hooks/use-create-appointment";
import { useServices } from "../../hooks/use-services";

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

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
          <SectionTitle
            title="Cabeleleila Leila"
            description="Novo agendamento"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              Meus agendamentos
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[1.4fr_0.8fr] gap-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <SectionTitle
              title="1. Escolha os servicos"
              description="Selecione um ou mais servicos para consultar os horarios vagos."
            />

            <div className="flex flex-col gap-4">
              {isLoadingServices && (
                <p className="text-sm text-slate-400">Carregando servicos...</p>
              )}

              {!isLoadingServices && servicesErrorMessage && (
                <p className="text-sm text-rose-300">{servicesErrorMessage}</p>
              )}

              {!isLoadingServices &&
                !servicesErrorMessage &&
                services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedServices.includes(service.id)}
                    onSelect={() => {
                      clearMessages();
                      toggleService(service.id);
                    }}
                    formatPrice={formatPrice}
                  />
                ))}
            </div>

            <div className="mt-10">
              <SectionTitle
                title="2. Escolha o dia"
                description="A exibicao de horarios sera baseada no dia selecionado."
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
                className="mt-4 h-12 w-64 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            <div className="mt-10">
              <SectionTitle
                title="3. Horarios vagos"
                description={availabilityDescription}
              />

              {isLoadingAvailability && (
                <p className="mt-4 text-sm text-slate-400">
                  Buscando horarios disponiveis...
                </p>
              )}

              {!isLoadingAvailability && availabilityErrorMessage && (
                <p className="mt-4 text-sm text-rose-300">
                  {availabilityErrorMessage}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {availableSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.startDateTime}
                    time={slot.startTime}
                    selected={selectedTime === slot.startTime}
                    disabled={
                      selectedServices.length === 0 ||
                      !selectedDate ||
                      isLoadingAvailability ||
                      isCreatingAppointment
                    }
                    onClick={() => {
                      clearMessages();
                      setSelectedTime(slot.startTime);
                    }}
                  />
                ))}
              </div>

              {selectedServices.length > 0 &&
                selectedDate &&
                !isLoadingAvailability &&
                !availabilityErrorMessage &&
                availableSlots.length === 0 && (
                  <p className="mt-4 text-sm text-amber-400">
                    Nenhum horario vago encontrado para este dia.
                  </p>
                )}
            </div>
          </section>

          <SummaryCard
            title="Resumo do agendamento"
            description="Confira os dados antes de confirmar"
          >
            <div className="flex flex-col gap-5">
              {createAppointmentSuccessMessage && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {createAppointmentSuccessMessage}
                </div>
              )}

              {suggestionMessage && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {suggestionMessage}
                </div>
              )}

              {createAppointmentErrorMessage && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {createAppointmentErrorMessage}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-slate-400">Servicos</p>

                <div className="mt-2 flex flex-col gap-2">
                  {selectedServiceDetails.length > 0 ? (
                    selectedServiceDetails.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                      >
                        {service.serviceType}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Nenhum servico selecionado.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Duracao total</p>
                <strong className="mt-1 block text-lg text-white">
                  {totalDuration > 0 ? `${totalDuration} minutos` : "--"}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Valor total</p>
                <strong className="mt-1 block text-lg text-white">
                  {totalPrice > 0 ? formatPrice(totalPrice) : "--"}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Dia escolhido</p>
                <strong className="mt-1 block text-lg text-white">
                  {selectedDate || "--"}
                </strong>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Horario</p>
                <strong className="mt-1 block text-lg text-white">
                  {selectedTime || "--"}
                </strong>
              </div>

              <button
                type="button"
                disabled={
                  selectedServices.length === 0 ||
                  !selectedDate ||
                  !selectedTime ||
                  isCreatingAppointment
                }
                onClick={handleCreateAppointment}
                className="h-12 rounded-xl bg-cyan-500 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingAppointment ? "Agendando..." : "Confirmar agendamento"}
              </button>
            </div>
          </SummaryCard>
        </div>
      </div>
    </div>
  );
};

export default Home;
