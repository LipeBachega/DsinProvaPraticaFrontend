import SummaryCard from "../../../components/summaryCard";

interface AppointmentsSummaryProps {
  counters: {
    total: number;
    pendentes: number;
    confirmados: number;
    cancelados: number;
    concluidos: number;
  };
}

const AppointmentsSummary = ({ counters }: AppointmentsSummaryProps) => {
  return (
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
      <SummaryCard title="Concluídos">
        <p className="text-3xl font-semibold text-white">
          {counters.concluidos}
        </p>
      </SummaryCard>
    </div>
  );
};

export default AppointmentsSummary;
