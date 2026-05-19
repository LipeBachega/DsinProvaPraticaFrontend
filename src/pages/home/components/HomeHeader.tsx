import SectionTitle from "../../../components/sectionTitle";

interface HomeHeaderProps {
  onViewAppointments: () => void;
  onLogout: () => void;
}

const HomeHeader = ({ onViewAppointments, onLogout }: HomeHeaderProps) => {
  return (
    // Cabeçalho isolado porque ele concentra navegação da home.
    // TODO: colocar o cabeçalho em uma componente separado.
    // TODO: criar cabeçalho personalizado para cliente e administrador.
    <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
      <SectionTitle title="Cabeleleila Leila" description="Novo agendamento" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onViewAppointments}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
        >
          Meus agendamentos
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default HomeHeader;
