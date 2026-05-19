import SectionTitle from "../../../components/sectionTitle";

interface AppointmentsHeaderProps {
  isAdminView: boolean;
  onBack: () => void;
}

const AppointmentsHeader = ({
  isAdminView,
  onBack,
}: AppointmentsHeaderProps) => {
  return (
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
        onClick={onBack}
        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
      >
        Voltar
      </button>
    </header>
  );
};

export default AppointmentsHeader;
