import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointmentsHistory } from "../../hooks/use-appointments-history";
import AppointmentsFilters from "./components/AppointmentsFilters";
import AppointmentsHeader from "./components/AppointmentsHeader";
import AppointmentsListSection from "./components/AppointmentsListSection";
import AppointmentsSummary from "./components/AppointmentsSummary";
import {
  getCurrentUserRole,
  getStatusCount,
  type AppointmentFilter,
} from "./utils";

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

  // aqui contamos o total de cada status para mostrar no resumo
  // usei useMemo para evitar que a contagem mude apenas se appointments mudar.
  const counters = useMemo(() => {
    return {
      total: appointments.length,
      pendentes: getStatusCount(appointments, "PENDENTE"),
      confirmados: getStatusCount(appointments, "CONFIRMADO"),
      cancelados: getStatusCount(appointments, "CANCELADO"),
      concluidos: getStatusCount(appointments, "CONCLUIDO"),
    };
  }, [appointments]);

  const isPeriodInvalid = period.startDate > period.endDate;

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
        <AppointmentsHeader
          isAdminView={isAdminView}
          onBack={() => navigate("/home")}
        />

        <AppointmentsSummary counters={counters} />

        <AppointmentsFilters
          activeFilter={activeFilter}
          isAdminView={isAdminView}
          isPeriodInvalid={isPeriodInvalid}
          period={period}
          onFilterChange={setActiveFilter}
          onPeriodChange={handlePeriodChange}
        />

        <AppointmentsListSection
          appointments={filteredAppointments}
          errorMessage={errorMessage}
          isAdminView={isAdminView}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Appointments;
