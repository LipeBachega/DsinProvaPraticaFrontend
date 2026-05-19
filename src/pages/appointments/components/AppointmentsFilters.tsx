import type { ChangeEvent } from "react";
import SectionTitle from "../../../components/sectionTitle";
import type { IAppointmentHistoryQuery } from "../../../types/appointment.type";
import {
  appointmentFilters,
  statusLabelMap,
  type AppointmentFilter,
} from "../utils";

interface AppointmentsFiltersProps {
  activeFilter: AppointmentFilter; // o filtro ativo, para sabermos qual botão destacar e quais agendamento mostrar
  isAdminView: boolean; // se o usuário é admin ou cliente
  isPeriodInvalid: boolean; // se a data inicial é maior que a data final
  period: IAppointmentHistoryQuery; // a data inicial e final escolhidas pelo usuário
  onFilterChange: (filter: AppointmentFilter) => void; // o filtro é alterado quando o usuário clica em um botão
  onPeriodChange: (
    // o campo de data é alterado quando o usuário clica em um botão
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
            ? "Escolha o período, o status e filtre clientes por nome ou telefone."
            : "Escolha o período e o status que deseja visualizar."
        }
      />

      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Data inicial</label>
          <input
            type="date"
            value={period.startDate}
            // Utilizamos Currying para criar um handler genérico.
            // Isso permite que o mesmo componente trate diferentes campos (start, end, search)
            // de forma limpa e sem repetir lógica de atualização de estado no pai.
            onChange={onPeriodChange("startDate")} // aqui passamos o campo que queremos atualizar para o handler genérico que está no pai.
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

        {/* Aqui mostramos o campo de busca para clientes ou telefones. 
        é renderizado apenas no modo admin */}
        {isAdminView && (
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm text-slate-300">
              Cliente ou telefone
            </label>
            <input
              type="text"
              value={period.search ?? ""}
              onChange={onPeriodChange("search")}
              placeholder="Ex.: Maria ou 14999990002"
              className="h-12 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* Aqui mostramos a mensagem de erro caso o usuario tenha escolhido uma data inválida */}

      {isPeriodInvalid && (
        <p className="mt-3 text-sm text-amber-300">
          A data inicial não pode ser maior que a data final.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {appointmentFilters.map((filter) => {
          const isActive = activeFilter === filter;
          const label = filter === "TODOS" ? "Todos" : statusLabelMap[filter];

          return (
            <button
              key={filter}
              // Garantimos que o botão tenha 'type="button"' para evitar que ele submeta
              // formulários acidentalmente, já que este componente vive dentro de uma seção de filtros.
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
