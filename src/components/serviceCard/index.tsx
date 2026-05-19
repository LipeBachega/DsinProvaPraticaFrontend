import type { IService } from "../../types/service.type";

interface ServiceCardProps {
  service: IService;
  isSelected: boolean;
  onSelect: () => void;
  formatPrice: (value: number) => string;
}

const ServiceCard = ({
  service,
  isSelected,
  onSelect,
  formatPrice,
}: ServiceCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border p-5 text-left transition ${
        isSelected
          ? "border-cyan-500 bg-cyan-500/10"
          : "border-slate-800 bg-slate-950 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {service.serviceType}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Duracao de {service.estimatedTimeInMinutes} minutos
          </p>
        </div>

        <span className="text-base font-semibold text-cyan-400">
          {formatPrice(service.price)}
        </span>
      </div>
    </button>
  );
};

export default ServiceCard;
