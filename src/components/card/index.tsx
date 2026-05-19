import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div
      className="
        w-full
        max-w-md
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-8
        shadow-2xl
      "
    >
      {children}
    </div>
  );
};

export default Card;
