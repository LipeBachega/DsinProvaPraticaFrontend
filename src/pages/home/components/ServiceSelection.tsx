import SectionTitle from "../../../components/sectionTitle";
import type { IService } from "../../../types/service.type";

interface ServiceSelectionProps {
  services: IService[];
  selectedServices: number[];
  isLoading: boolean;
  errorMessage: string;
  formatPrice: (value: number) => string;
  onToggleService: (serviceId: number) => void;
}

const ServiceSelection = ({
  services,
  selectedServices,
  isLoading,
  errorMessage,
  formatPrice,
  onToggleService,
}: ServiceSelectionProps) => {
  return (
    <div>
      <SectionTitle
        title="1. Escolha os serviços"
        description="Selecione um ou mais serviços para consultar os horários disponíveis."
      />

      {isLoading && (
        <p className="text-sm text-slate-400">Carregando serviços...</p>
      )}

      {!isLoading && errorMessage && (
        <p className="text-sm text-rose-300">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.map((service) => {
            const isSelected = selectedServices.includes(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onToggleService(service.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-800 bg-slate-950 hover:border-cyan-500/60"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">
                  {service.serviceType}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Duração de {service.estimatedTimeInMinutes} minutos
                </p>
                <p className="mt-4 text-base font-semibold text-cyan-300">
                  {formatPrice(service.price)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
