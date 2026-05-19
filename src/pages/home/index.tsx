import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvailability } from "../../hooks/use-availability";
import { useServices } from "../../hooks/use-services";

const Home = () => {
  const navigate = useNavigate();
  const { services, isLoading: isLoadingServices, errorMessage: servicesErrorMessage } =
    useServices();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const {
    availableSlots,
    isLoading: isLoadingAvailability,
    errorMessage: availabilityErrorMessage,
  } = useAvailability(selectedDate, selectedServices);

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
    return selectedServiceDetails.reduce((total, service) => total + service.price, 0);
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
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
          <div>
            <p className="text-sm text-slate-400">Cabeleleila Leila</p>
            <h1 className="text-3xl font-bold text-white">Novo agendamento</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            Sair
          </button>
        </header>

        <div className="grid grid-cols-[1.4fr_0.8fr] gap-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">1. Escolha os serviços</h2>
              <p className="mt-1 text-sm text-slate-400">
                Selecione um ou mais serviços para consultar os horários vagos.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {isLoadingServices && (
                <p className="text-sm text-slate-400">Carregando servicos...</p>
              )}

              {!isLoadingServices && servicesErrorMessage && (
                <p className="text-sm text-rose-300">{servicesErrorMessage}</p>
              )}

              {!isLoadingServices &&
                !servicesErrorMessage &&
                services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-slate-800 bg-slate-950 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {service.serviceType}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            Duracao de {service.estimatedTimeInMinutes} minutos
                          </p>
                        </div>

                        <span className="text-base font-semibold text-cyan-400">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-white">2. Escolha o dia</h2>
              <p className="mt-1 text-sm text-slate-400">
                A exibicao de horarios sera baseada no dia selecionado.
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => handleDateChange(event.target.value)}
                className="mt-4 h-12 w-64 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-white">3. Horarios vagos</h2>
              <p className="mt-1 text-sm text-slate-400">
                {selectedServices.length === 0
                  ? "Escolha ao menos um servico para liberar a busca de horarios."
                  : !selectedDate
                    ? "Selecione um dia para ver os horarios disponiveis."
                    : "Escolha um horario livre para finalizar o agendamento."}
              </p>

              {isLoadingAvailability && (
                <p className="mt-4 text-sm text-slate-400">Buscando horarios disponiveis...</p>
              )}

              {!isLoadingAvailability && availabilityErrorMessage && (
                <p className="mt-4 text-sm text-rose-300">{availabilityErrorMessage}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.startTime;

                  return (
                    <button
                      key={slot.startDateTime}
                      type="button"
                      disabled={
                        selectedServices.length === 0 ||
                        !selectedDate ||
                        isLoadingAvailability
                      }
                      onClick={() => setSelectedTime(slot.startTime)}
                      className={`min-w-24 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500 text-slate-950"
                          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-500"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
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

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">Resumo</h2>
            <p className="mt-1 text-sm text-slate-400">
              Confira os dados antes de confirmar.
            </p>

            <div className="mt-6 flex flex-col gap-5">
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
                    <p className="text-sm text-slate-500">Nenhum servico selecionado.</p>
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
                  selectedServices.length === 0 || !selectedDate || !selectedTime
                }
                className="h-12 rounded-xl bg-cyan-500 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirmar agendamento
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
