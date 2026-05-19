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
    <div className="mt-8">
      <SectionTitle
        title="2. Escolha o dia"
        description="A exibição dos horários será baseada na data selecionada."
      />

      <input
        type="date"
        value={selectedDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(event) => onChangeDate(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
      />
    </div>
  );
};

export default DateSelection;
