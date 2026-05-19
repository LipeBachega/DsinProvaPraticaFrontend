import type { ChangeEvent } from "react";
import SectionTitle from "../../../components/sectionTitle";
import type { IAppointmentHistoryQuery } from "../../../types/appointment.type";
import {
  appointmentFilters,
  statusLabelMap,
  type AppointmentFilter,
} from "../utils";

interface AppointmentsFiltersProps {
  activeFilter: AppointmentFilter;
  isAdminView: boolean;
  isPeriodInvalid: boolean;
  period: IAppointmentHistoryQuery;
  onFilterChange: (filter: AppointmentFilter) => void;
  onPeriodChange: (
    field: "startDate" | "endDate" | "search",
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
}

const AppointmentsFilters = ({
  activeFilter,
  isAdminView,
  isPeriodInvalid,
  period,
  onFilterChange,
  onPeriodChange,
}: AppointmentsFiltersProps) => {
  return (
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
            onChange={onPeriodChange("startDate")}
            max={period.endDate}
            className="h-12 w-52 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Data final</label>
          <input
            type="date"
            value={period.endDate}
            onChange={onPeriodChange("endDate")}
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
              onChange={onPeriodChange("search")}
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
        {appointmentFilters.map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === "TODOS" ? "Todos" : statusLabelMap[filter];

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
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
  );
};

export default AppointmentsFilters;
