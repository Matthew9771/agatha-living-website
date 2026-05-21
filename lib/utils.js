export const DAY_MS = 24 * 60 * 60 * 1000;

export function parseDateKey(value) {
  if (!value || typeof value !== 'string') return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function getNightsBetween(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

export function formatLongDate(value) {
  const parsed = parseDateKey(value);
  if (!parsed) return value || 'Selected dates';
  try {
    return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return value;
  }
}

export function formatMonthLabel(date) {
  try {
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  } catch {
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  }
}

export function formatCurrency(value) {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `£${value}`;
  }
}
