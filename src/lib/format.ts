export function formatPrice(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} DA`;
}

export function formatDate(isoString: string, lang: string): string {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-DZ" : "fr-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoString));
}
