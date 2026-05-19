import SectionTitle from "../../../components/sectionTitle";

interface DetailsHeaderProps {
  onBack: () => void;
}

const DetailsHeader = ({ onBack }: DetailsHeaderProps) => {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
      <SectionTitle
        title="Detalhes do agendamento"
        description="Consulte os serviços, acompanhe o status e gerencie o reagendamento."
      />

      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
      >
        Voltar ao histórico
      </button>
    </header>
  );
};

export default DetailsHeader;
