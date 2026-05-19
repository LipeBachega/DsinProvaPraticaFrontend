import type { IAppointmentDetail } from "../../types/appointment.type";

interface AppointmentHistoryCardProps {
  appointment: IAppointmentDetail;
  statusClassName: string;
  formatDateTime: (value: string | Date) => string;
  formatHour: (value: string | Date) => string;
  formatPrice: (value: number) => string;
  getAppointmentTotal: (appointment: IAppointmentDetail) => number;
}

const AppointmentHistoryCard = ({
  appointment,
  statusClassName,
  formatDateTime,
  formatHour,
  formatPrice,
  getAppointmentTotal,
}: AppointmentHistoryCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {appointment.services
              .map((service) => service.serviceType)
              .join(" + ")}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {formatDateTime(appointment.startDate)} ate{" "}
            {formatHour(appointment.endDate)}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClassName}`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-sm text-slate-400">Servicos</p>

          <p className="mt-1 text-sm text-white">
            {appointment.services.length} selecionado(s)
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-sm text-slate-400">Valor total</p>

          <p className="mt-1 text-sm text-white">
            {formatPrice(getAppointmentTotal(appointment))}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-sm text-slate-400">Status</p>

          <p className="mt-1 text-sm text-white">{appointment.status}</p>
        </div>
      </div>
    </article>
  );
};

export default AppointmentHistoryCard;
