import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentHistoryCard from "../../components/appointmentHistoryCard";
import SectionTitle from "../../components/sectionTitle";
import SummaryCard from "../../components/summaryCard";
import { useAppointmentsHistory } from "../../hooks/use-appointments-history";
import { formatCurrency } from "../../utils/currency";
import { formatDateTime, formatHour } from "../../utils/date";
import type {
  AppointmentStatus,
  IAppointmentDetail,
} from "../../types/appointment.type";

// O filtro "TODOS" é uma convenção visual da tela; os demais valores vêm do domínio.
type AppointmentFilter = "TODOS" | AppointmentStatus;

const statusLabelMap: Record<AppointmentStatus, string> = {
  PENDENTE: "Pendentes",
  CONFIRMADO: "Confirmados",
  CANCELADO: "Cancelados",
  CONCLUIDO: "Concluidos",
};

const statusClassMap: Record<AppointmentStatus, string> = {
  PENDENTE: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  CONFIRMADO: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  CANCELADO: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  CONCLUIDO: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

function getAppointmentTotal(appointment: IAppointmentDetail) {
  // O backend devolve os serviços do agendamento; aqui somamos para exibir o valor final.
  return appointment.services.reduce(
    (total, service) => total + service.price,
    0,
  );
}

function getStatusCount(
  appointments: IAppointmentDetail[],
  status: AppointmentStatus,
) {
  return appointments.filter((appointment) => appointment.status === status)
    .length;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { period, setPeriod, appointments, isLoading, errorMessage } =
    useAppointmentsHistory();
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>("TODOS");

  const filteredAppointments = useMemo(() => {
    // O filtro atua apenas sobre os dados já carregados, sem nova ida ao backend.
    if (activeFilter === "TODOS") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === activeFilter,
    );
  }, [activeFilter, appointments]);

  const counters = useMemo(() => {
    // Esses contadores alimentam o painel-resumo por status logo no topo da página.
    return {
      total: appointments.length,
      pendentes: getStatusCount(appointments, "PENDENTE"),
      confirmados: getStatusCount(appointments, "CONFIRMADO"),
      cancelados: getStatusCount(appointments, "CANCELADO"),
      concluidos: getStatusCount(appointments, "CONCLUIDO"),
    };
  }, [appointments]);

  const handlePeriodChange =
    (field: "startDate" | "endDate") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      // Mudanças de período disparam nova busca no hook de histórico.
      setPeriod((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
          <SectionTitle
            title="Meus agendamentos"
            description="Acompanhe todos os horarios do cliente por status."
          />

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            Voltar
          </button>
        </header>

        <div className="grid grid-cols-5 gap-4">
          <SummaryCard title="Todos">
            <p className="text-3xl font-semibold text-white">
              {counters.total}
            </p>
          </SummaryCard>
          <SummaryCard title="Pendentes">
            <p className="text-3xl font-semibold text-white">
              {counters.pendentes}
            </p>
          </SummaryCard>
          <SummaryCard title="Confirmados">
            <p className="text-3xl font-semibold text-white">
              {counters.confirmados}
            </p>
          </SummaryCard>
          <SummaryCard title="Cancelados">
            <p className="text-3xl font-semibold text-white">
              {counters.cancelados}
            </p>
          </SummaryCard>
          <SummaryCard title="Concluidos">
            <p className="text-3xl font-semibold text-white">
              {counters.concluidos}
            </p>
          </SummaryCard>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <SectionTitle
            title="Filtros"
            description="Escolha o periodo e o status que deseja visualizar."
          />

          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Data inicial</label>
              <input
                type="date"
                value={period.startDate}
                onChange={handlePeriodChange("startDate")}
                className="h-12 w-52 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Data final</label>
              <input
                type="date"
                value={period.endDate}
                onChange={handlePeriodChange("endDate")}
                className="h-12 w-52 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Os botões abaixo não pedem nova busca; só filtram visualmente a lista atual. */}
            {(
              [
                "TODOS",
                "PENDENTE",
                "CONFIRMADO",
                "CANCELADO",
                "CONCLUIDO",
              ] as AppointmentFilter[]
            ).map((filter) => {
              const isActive = activeFilter === filter;
              const label =
                filter === "TODOS" ? "Todos" : statusLabelMap[filter];

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-cyan-500 bg-cyan-500 text-slate-950"
                      : "border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <SectionTitle
            title="Historico do cliente"
            description="Todos os agendamentos encontrados no periodo selecionado."
          />

          {isLoading && (
            <p className="text-sm text-slate-400">Carregando agendamentos...</p>
          )}

          {!isLoading && errorMessage && (
            <p className="text-sm text-rose-300">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && filteredAppointments.length === 0 && (
            <p className="text-sm text-slate-400">
              Nenhum agendamento encontrado para este filtro.
            </p>
          )}

          {!isLoading && !errorMessage && filteredAppointments.length > 0 && (
            <div className="flex flex-col gap-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentHistoryCard
                  key={appointment.id}
                  appointment={appointment}
                  statusClassName={statusClassMap[appointment.status]}
                  formatDateTime={formatDateTime}
                  formatHour={formatHour}
                  formatPrice={formatCurrency}
                  getAppointmentTotal={getAppointmentTotal}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Appointments;
