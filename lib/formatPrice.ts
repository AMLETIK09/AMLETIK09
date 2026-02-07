export function formatPrice(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return '—';
  try {
    // ru-RU uses non-breaking spaces as thousands separator which is fine for display
    return Number(value).toLocaleString('ru-RU');
  } catch (e) {
    return String(value);
  }
}
