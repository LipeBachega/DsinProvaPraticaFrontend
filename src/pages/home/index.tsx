import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: 1,
    name: "Corte de Cabelo",
    price: "R$ 50",
    duration: 60,
  },
  {
    id: 2,
    name: "Manicure",
    price: "R$ 35",
    duration: 45,
  },
  {
    id: 3,
    name: "Pintura",
    price: "R$ 120",
    duration: 120,
  },
];

const availableSlotsByDay: Record<string, string[]> = {
  "2026-05-20": ["09:00", "10:30", "14:00", "16:30"],
  "2026-05-21": ["08:00", "11:00", "13:30", "15:00"],
  "2026-05-22": ["09:30", "12:00", "17:00"],
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const availableSlots = selectedDate ? availableSlotsByDay[selectedDate] ?? [] : [];

  const selectedServiceDetails = services.filter((service) =>
    selectedServices.includes(service.id),
  );

  const totalDuration = useMemo(() => {
    return selectedServiceDetails.reduce((total, service) => total + service.duration, 0);
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
              {services.map((service) => {
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
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          Duracao de {service.duration} minutos
                        </p>
                      </div>

                      <span className="text-base font-semibold text-cyan-400">
                        {service.price}
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

              <div className="mt-4 flex flex-wrap gap-3">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={selectedServices.length === 0 || !selectedDate}
                      onClick={() => setSelectedTime(slot)}
                      className={`min-w-24 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500 text-slate-950"
                          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-500"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              {selectedServices.length > 0 && selectedDate && availableSlots.length === 0 && (
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
                        {service.name}
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
