export function formatCurrency(value: number) {
  // Mantemos a formatação monetária centralizada para evitar duplicação.
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
