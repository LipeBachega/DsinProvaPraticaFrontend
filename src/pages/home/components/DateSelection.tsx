import SectionTitle from "../../../components/sectionTitle";

interface DateSelectionProps {
  selectedDate: string;
  onChangeDate: (date: string) => void;
}

const DateSelection = ({
  selectedDate,
  onChangeDate,
}: DateSelectionProps) => {
  return (
    <div className="mt-10">
      <SectionTitle
        title="2. Escolha o dia"
        description="A exibicao de horarios sera baseada no dia selecionado."
      />

      <input
        type="date"
        value={selectedDate}
        onChange={(event) => onChangeDate(event.target.value)}
        className="mt-4 h-12 w-64 rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
      />
    </div>
  );
};

export default DateSelection;
