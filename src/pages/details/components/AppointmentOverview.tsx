import SummaryCard from "../../../components/summaryCard";
import type { IAppointmentDetail } from "../../../types/appointment.type";

interface AppointmentOverviewProps {
  appointment: IAppointmentDetail;
  formatDateTime: (value: string | Date) => string;
  formatHour: (value: string | Date) => string;
  formatPrice: (value: number) => string;
  getAppointmentTotal: (appointment: IAppointmentDetail) => number;
  isCustomerView: boolean;
}

const AppointmentOverview = ({
  appointment,
  formatDateTime,
  formatHour,
  formatPrice,
  getAppointmentTotal,
  isCustomerView,
}: AppointmentOverviewProps) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="Data e horario">
          <p className="text-lg font-semibold text-white">
            {formatDateTime(appointment.startDate)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            ate {formatHour(appointment.endDate)}
          </p>
        </SummaryCard>

        <SummaryCard title="Valor total">
          <p className="text-3xl font-semibold text-white">
            {formatPrice(getAppointmentTotal(appointment))}
          </p>
        </SummaryCard>

        <SummaryCard title="Status">
          <p className="text-3xl font-semibold text-white">
            {appointment.status}
          </p>
        </SummaryCard>
      </div>

      {!isCustomerView && appointment.customer && (
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard title="Cliente">
            <p className="text-lg font-semibold text-white">
              {appointment.customer.name}
            </p>
          </SummaryCard>

          <SummaryCard title="Telefone">
            <p className="text-lg font-semibold text-white">
              {appointment.customer.phone}
            </p>
          </SummaryCard>

          <SummaryCard title="E-mail">
            <p className="text-sm font-semibold text-white">
              {appointment.customer.email}
            </p>
          </SummaryCard>
        </div>
      )}
    </>
  );
};

export default AppointmentOverview;
