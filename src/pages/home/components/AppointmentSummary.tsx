import SummaryCard from "../../../components/summaryCard";
import type { IService } from "../../../types/service.type";

interface AppointmentSummaryProps {
  selectedServiceDetails: IService[];
  totalDuration: number;
  totalPrice: number;
  selectedDate: string;
  selectedTime: string;
  isCreatingAppointment: boolean;
  createAppointmentErrorMessage: string;
  createAppointmentSuccessMessage: string;
  suggestionMessage: string;
  formatPrice: (value: number) => string;
  onConfirmAppointment: () => void;
}

const AppointmentSummary = ({
  selectedServiceDetails,
  totalDuration,
  totalPrice,
  selectedDate,
  selectedTime,
  isCreatingAppointment,
  createAppointmentErrorMessage,
  createAppointmentSuccessMessage,
  suggestionMessage,
  formatPrice,
  onConfirmAppointment,
}: AppointmentSummaryProps) => {
  return (
    // O resumo recebe tudo pronto da home e apenas apresenta/aciona a confirmação.
    <SummaryCard
      title="Resumo do agendamento"
      description="Confira os dados antes de confirmar"
    >
      <div className="flex flex-col gap-5">
        {/* Mensagens de sucesso, sugestão e erro ficam juntas para o usuário entender o resultado final. */}
        {createAppointmentSuccessMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {createAppointmentSuccessMessage}
          </div>
        )}

        {suggestionMessage && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {suggestionMessage}
          </div>
        )}

        {createAppointmentErrorMessage && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {createAppointmentErrorMessage}
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-slate-400">Servicos</p>

          <div className="mt-2 flex flex-col gap-2">
            {selectedServiceDetails.length > 0 ? (
              selectedServiceDetails.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200"
                >
                  {service.serviceType}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Nenhum servico selecionado.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Duracao total</p>
          <strong className="mt-1 block text-lg text-white">
            {totalDuration > 0 ? `${totalDuration} minutos` : "--"}
          </strong>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Valor total</p>
          <strong className="mt-1 block text-lg text-white">
            {totalPrice > 0 ? formatPrice(totalPrice) : "--"}
          </strong>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Dia escolhido</p>
          <strong className="mt-1 block text-lg text-white">
            {selectedDate || "--"}
          </strong>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Horario</p>
          <strong className="mt-1 block text-lg text-white">
            {selectedTime || "--"}
          </strong>
        </div>

        <button
          type="button"
          disabled={
            selectedServiceDetails.length === 0 ||
            !selectedDate ||
            !selectedTime ||
            isCreatingAppointment
          }
          onClick={onConfirmAppointment}
          className="h-12 rounded-xl bg-cyan-500 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreatingAppointment ? "Agendando..." : "Confirmar agendamento"}
        </button>
      </div>
    </SummaryCard>
  );
};

export default AppointmentSummary;
