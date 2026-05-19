import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const Button = ({ title, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="
        h-12
        rounded-xl
        bg-cyan-500
        text-slate-950
        font-semibold
        transition-all
        hover:opacity-90
        cursor-pointer
        disabled:opacity-50
      "
    >
      {title}
    </button>
  );
};

export default Button;
