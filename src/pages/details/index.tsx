import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointmentDetailRequest,
  updateAppointmentRequest,
  updateAppointmentStatusRequest,
} from "../../api/appointment";
import { ApiRequestError } from "../../api/shared";
import Button from "../../components/button";
import SectionTitle from "../../components/sectionTitle";
import SummaryCard from "../../components/summaryCard";
import TimeSlotButton from "../../components/timeSlotButton.tsx";
import { useAvailability } from "../../hooks/use-availability";
import type { IAppointmentDetail } from "../../types/appointment.type";
import { formatCurrency } from "../../utils/currency";
import {
  formatDateTime,
  formatDateToInput,
  formatHour,
} from "../../utils/date";

function getAppointmentTotal(appointment: IAppointmentDetail) {
  return appointment.services.reduce(
    (total, service) => total + service.price,
    0,
  );
}

function getTotalDuration(appointment: IAppointmentDetail) {
  return appointment.services.reduce(
    (total, service) => total + service.estimatedTimeInMinutes,
    0,
  );
}

function getMinimumRescheduleDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return formatDateToInput(date);
}

function canManageAppointment(appointment: IAppointmentDetail) {
  return (
    appointment.status !== "CANCELADO" && appointment.status !== "CONCLUIDO"
  );
}

const AppointmentDetails = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState<IAppointmentDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const serviceIds = useMemo(() => {
    return appointment?.services.map((service) => service.id) ?? [];
  }, [appointment]);

  const {
    availableSlots,
    isLoading: isLoadingAvailability,
    errorMessage: availabilityErrorMessage,
    refetch: refetchAvailability,
  } = useAvailability(selectedDate, serviceIds);

  const minimumRescheduleDate = getMinimumRescheduleDate();

  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) {
        setErrorMessage("Agendamento não encontrado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAppointmentDetailRequest(Number(appointmentId));
        setAppointment(response.data ?? null);
      } catch (error) {
        if (error instanceof ApiRequestError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar os detalhes do agendamento.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointment();
  }, [appointmentId]);

  const canReschedule = useMemo(() => {
    if (!appointment || !canManageAppointment(appointment)) {
      return false;
    }

    return formatDateToInput(new Date(appointment.startDate)) >= minimumRescheduleDate;
  }, [appointment, minimumRescheduleDate]);

  const selectedSlot = useMemo(() => {
    return availableSlots.find((slot) => slot.startTime === selectedTime) ?? null;
  }, [availableSlots, selectedTime]);

  const handleCancelAppointment = async () => {
    if (!appointment) {
      return;
    }

    setIsCancelling(true);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await updateAppointmentStatusRequest(appointment.id, {
        status: "CANCELADO",
      });

      setAppointment((current) =>
        current ? { ...current, status: "CANCELADO" } : current,
      );
      setActionMessage(response.message || "Agendamento cancelado com sucesso.");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível cancelar o agendamento.");
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!appointment || !selectedSlot) {
      return;
    }

    setIsRescheduling(true);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await updateAppointmentRequest(appointment.id, {
        startDate: selectedSlot.startDateTime,
        serviceIds,
      });

      if (!response.data?.appointment) {
        setErrorMessage("Não foi possível carregar o agendamento atualizado.");
        return;
      }

      setAppointment(response.data.appointment);
      setSelectedTime("");
      refetchAvailability();
      setActionMessage(response.message || "Agendamento reagendado com sucesso.");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível reagendar o agendamento.");
      }
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
          <SectionTitle
            title="Detalhes do agendamento"
            description="Consulte os servicos, acompanhe o status e gerencie cancelamento ou reagendamento."
          />

          <button
            type="button"
            onClick={() => navigate("/appointments")}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            Voltar ao historico
          </button>
        </header>

        {isLoading && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Carregando detalhes do agendamento...
            </p>
          </section>
        )}

        {!isLoading && errorMessage && !appointment && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-rose-300">{errorMessage}</p>
          </section>
        )}

        {!isLoading && appointment && (
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
                  {formatCurrency(getAppointmentTotal(appointment))}
                </p>
              </SummaryCard>

              <SummaryCard title="Status">
                <p className="text-3xl font-semibold text-white">
                  {appointment.status}
                </p>
              </SummaryCard>
            </div>

            <div className="grid grid-cols-[1.1fr_0.9fr] gap-6">
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
                          <p className="font-semibold text-white">
                            {service.serviceType}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {service.estimatedTimeInMinutes} min
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-cyan-300">
                          {formatCurrency(service.price)}
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

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <SectionTitle
                  title="Acoes"
                  description="Gerencie este agendamento sem sair da tela de detalhes."
                />

                {errorMessage && (
                  <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                    {errorMessage}
                  </p>
                )}

                {actionMessage && (
                  <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    {actionMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCancelAppointment}
                  disabled={!canManageAppointment(appointment) || isCancelling}
                  className="h-12 w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCancelling ? "Cancelando..." : "Cancelar agendamento"}
                </button>

                {!canManageAppointment(appointment) && (
                  <p className="mt-4 text-sm text-slate-400">
                    Este agendamento nao permite novas alteracoes porque ja foi
                    finalizado ou cancelado.
                  </p>
                )}

                {canManageAppointment(appointment) && !canReschedule && (
                  <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
                    Alteracoes com menos de 2 dias de antecedencia devem ser feitas
                    por telefone, conforme a regra do desafio.
                  </div>
                )}

                {canReschedule && (
                  <div className="mt-6">
                    <SectionTitle
                      title="Reagendar"
                      description="Escolha uma nova data e selecione um horario disponivel."
                    />

                    <input
                      type="date"
                      value={selectedDate}
                      min={minimumRescheduleDate}
                      onChange={(event) => {
                        setSelectedDate(event.target.value);
                        setSelectedTime("");
                        setErrorMessage("");
                        setActionMessage("");
                      }}
                      className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-white outline-none transition focus:border-cyan-500"
                    />

                    {isLoadingAvailability && (
                      <p className="mt-4 text-sm text-slate-400">
                        Buscando horarios disponiveis...
                      </p>
                    )}

                    {!isLoadingAvailability && availabilityErrorMessage && (
                      <p className="mt-4 text-sm text-rose-300">
                        {availabilityErrorMessage}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      {availableSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.startDateTime}
                          time={slot.startTime}
                          selected={selectedTime === slot.startTime}
                          disabled={isLoadingAvailability || isRescheduling}
                          onClick={() => {
                            setSelectedTime(slot.startTime);
                            setErrorMessage("");
                            setActionMessage("");
                          }}
                        />
                      ))}
                    </div>

                    {!!selectedDate &&
                      !isLoadingAvailability &&
                      !availabilityErrorMessage &&
                      availableSlots.length === 0 && (
                        <p className="mt-4 text-sm text-amber-400">
                          Nenhum horario disponivel para a nova data escolhida.
                        </p>
                      )}

                    <div className="mt-6">
                      <Button
                        title={
                          isRescheduling
                            ? "Reagendando..."
                            : "Confirmar reagendamento"
                        }
                        disabled={!selectedSlot || isRescheduling}
                        onClick={handleRescheduleAppointment}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
