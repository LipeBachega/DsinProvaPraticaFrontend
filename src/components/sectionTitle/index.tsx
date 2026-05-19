interface SectionTitleProps {
  title: string;
  description: string;
}

const SectionTitle = ({ title, description }: SectionTitleProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
};

export default SectionTitle;
