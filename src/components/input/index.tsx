import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* O label fica embutido para padronizar acessibilidade e aparência. */}
      <label className="text-sm text-slate-300">{label}</label>

      <input
        {...props}
        className="
          h-12
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          px-4
          text-white
          outline-none
          transition-all
          focus:border-cyan-500
        "
      />
    </div>
  );
};

export default Input;
