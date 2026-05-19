import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const SummaryCard = ({ title, description, children }: SummaryCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-xl text-white font-semibold">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      )}

      <div className="mt-6">{children}</div>
    </div>
  );
};

export default SummaryCard;
