interface TimeSlotButtonProps {
  time: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

const TimeSlotButton = ({
  time,
  selected,
  disabled,
  onClick,
}: TimeSlotButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-w-24 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        selected
          ? "border-cyan-500 bg-cyan-500 text-slate-950"
          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-500"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {time}
    </button>
  );
};

export default TimeSlotButton;
