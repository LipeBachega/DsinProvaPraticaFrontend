import { useNavigate } from "react-router-dom";
import AppointmentHistoryCard from "../../../components/appointmentHistoryCard";
import SectionTitle from "../../../components/sectionTitle";
import type { IAppointmentDetail } from "../../../types/appointment.type";
import { formatCurrency } from "../../../utils/currency";
import { formatDateTime, formatHour } from "../../../utils/date";
import { getAppointmentTotal, statusClassMap } from "../utils";

interface AppointmentsListSectionProps {
  appointments: IAppointmentDetail[];
  errorMessage: string | null;
  isAdminView: boolean;
  isLoading: boolean;
}

const AppointmentsListSection = ({
  appointments,
  errorMessage,
  isAdminView,
  isLoading,
}: AppointmentsListSectionProps) => {
  const navigate = useNavigate();

  return (
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

      {!isLoading && !errorMessage && appointments.length === 0 && (
        <p className="text-sm text-slate-400">
          Nenhum agendamento encontrado para este filtro.
        </p>
      )}

      {!isLoading && !errorMessage && appointments.length > 0 && (
        <div className="flex flex-col gap-4">
          {appointments.map((appointment) => (
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
  );
};

export default AppointmentsListSection;
