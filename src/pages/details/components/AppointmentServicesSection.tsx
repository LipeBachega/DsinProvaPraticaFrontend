import SectionTitle from "../../../components/sectionTitle";
import type { IAppointmentDetail } from "../../../types/appointment.type";

interface AppointmentServicesSectionProps {
  appointment: IAppointmentDetail;
  formatPrice: (value: number) => string;
  getTotalDuration: (appointment: IAppointmentDetail) => number;
}

const AppointmentServicesSection = ({
  appointment,
  formatPrice,
  getTotalDuration,
}: AppointmentServicesSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <SectionTitle
        title="Servicos agendados"
        description="Resumo completo do atendimento selecionado pela cliente."
      />

      <div className="flex flex-col gap-3">
        {appointment.services.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{service.serviceType}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {service.estimatedTimeInMinutes} min
                </p>
              </div>

              <p className="text-sm font-semibold text-cyan-300">
                {formatPrice(service.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 px-4 py-4">
        <p className="text-sm text-slate-400">Duracao total</p>
        <p className="mt-1 text-lg font-semibold text-white">
          {getTotalDuration(appointment)} min
        </p>
      </div>
    </section>
  );
};

export default AppointmentServicesSection;
