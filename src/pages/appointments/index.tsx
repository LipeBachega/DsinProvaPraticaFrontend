import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentHistoryCard from "../../components/appointmentHistoryCard";
import SectionTitle from "../../components/sectionTitle";
import SummaryCard from "../../components/summaryCard";
import { useAppointmentsHistory } from "../../hooks/use-appointments-history";
import { formatCurrency } from "../../utils/currency";
import { getToken } from "../../utils/auth-storage";
import { formatDateTime, formatHour } from "../../utils/date";
import type {
  AppointmentStatus,
  IAppointmentDetail,
} from "../../types/appointment.type";
import type { IUserRole } from "../../types/customer.type";

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

function getCurrentUserRole(): IUserRole | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);
    const parsedPayload = JSON.parse(decodedPayload) as { role?: IUserRole };

    return parsedPayload.role ?? null;
  } catch {
    return null;
  }
}

function getAppointmentTotal(appointment: IAppointmentDetail) {
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
  const isAdminView = getCurrentUserRole() === "ADMIN";

  const filteredAppointments = useMemo(() => {
    const sortedAppointments = [...appointments].sort((first, second) => {
      return (
        new Date(second.startDate).getTime() - new Date(first.startDate).getTime()
      );
    });

    if (activeFilter === "TODOS") {
      return sortedAppointments;
    }

    return sortedAppointments.filter(
      (appointment) => appointment.status === activeFilter,
    );
  }, [activeFilter, appointments]);

  const isPeriodInvalid = period.startDate > period.endDate;

  const counters = useMemo(() => {
    return {
      total: appointments.length,
      pendentes: getStatusCount(appointments, "PENDENTE"),
      confirmados: getStatusCount(appointments, "CONFIRMADO"),
      cancelados: getStatusCount(appointments, "CANCELADO"),
      concluidos: getStatusCount(appointments, "CONCLUIDO"),
    };
  }, [appointments]);

  const handlePeriodChange =
    (field: "startDate" | "endDate" | "search") =>
    (event: ChangeEvent<HTMLInputElement>) => {
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
            title={isAdminView ? "Agenda administrativa" : "Meus agendamentos"}
            description={
              isAdminView
                ? "Visualize todos os agendamentos e encontre clientes por nome ou telefone."
                : "Acompanhe todos os horarios do cliente por status."
            }
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
            <p className="text-3xl font-semibold text-white">{counters.total}</p>
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
            description={
              isAdminView
                ? "Escolha o periodo, o status e filtre clientes por nome ou telefone."
                : "Escolha o periodo e o status que deseja visualizar."
            }
          />

          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Data inicial</label>
              <input
                type="date"
                value={period.startDate}
                onChange={handlePeriodChange("startDate")}
                max={period.endDate}
                className="h-12 w-52 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-slate-300">Data final</label>
              <input
                type="date"
                value={period.endDate}
                onChange={handlePeriodChange("endDate")}
                min={period.startDate}
                className="h-12 w-52 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            {isAdminView && (
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm text-slate-300">
                  Cliente ou telefone
                </label>
                <input
                  type="text"
                  value={period.search ?? ""}
                  onChange={handlePeriodChange("search")}
                  placeholder="Ex.: teste2 ou 14999990002"
                  className="h-12 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {isPeriodInvalid && (
            <p className="mt-3 text-sm text-amber-300">
              A data inicial nao pode ser maior que a data final.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
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
            title={isAdminView ? "Todos os agendamentos" : "Historico do cliente"}
            description={
              isAdminView
                ? "Resultados encontrados para o periodo e filtros informados."
                : "Todos os agendamentos encontrados no periodo selecionado."
            }
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
                  onViewDetails={() =>
                    navigate(`/appointments/${appointment.id}/detalhes`)
                  }
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
