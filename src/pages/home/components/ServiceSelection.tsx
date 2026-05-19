import ServiceCard from "../../../components/serviceCard";
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
      {/* Esta seção cuida apenas do catálogo e da seleção visual dos serviços. */}
      <SectionTitle
        title="1. Escolha os servicos"
        description="Selecione um ou mais servicos para consultar os horarios vagos."
      />

      <div className="flex flex-col gap-4">
        {isLoading && (
          <p className="text-sm text-slate-400">Carregando servicos...</p>
        )}

        {!isLoading && errorMessage && (
          <p className="text-sm text-rose-300">{errorMessage}</p>
        )}

        {!isLoading &&
          !errorMessage &&
          services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              onSelect={() => onToggleService(service.id)}
              formatPrice={formatPrice}
            />
          ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
