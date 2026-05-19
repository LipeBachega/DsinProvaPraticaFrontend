export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatHour(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDateToInput(date: Date) {
  // O input type="date" trabalha no formato YYYY-MM-DD.
  return date.toISOString().split("T")[0];
}

export function getWeekRangeFromDate(value: string | Date) {
  // A partir de uma data qualquer, calculamos a segunda e o domingo da mesma semana.
  // Isso permite perguntar ao backend se o cliente já possui outro agendamento naquele período.
  const date = new Date(value);
  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  );
  const day = normalizedDate.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(normalizedDate);
  start.setDate(normalizedDate.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    startDate: formatDateToInput(start),
    endDate: formatDateToInput(end),
  };
}
