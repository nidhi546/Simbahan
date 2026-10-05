import { translate } from '../i18n';
import type { LanguageCode } from '../store/countryStore';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const monthShort = (language: LanguageCode, month: number): string =>
  translate(language, `dates.monthsShort.${MONTH_KEYS[month]}`);

export function timeAgo(dateStr: string, language: LanguageCode = 'fil'): string {
  const now = Date.now();
  const then = new Date(dateStr + 'T00:00:00').getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return translate(language, 'dates.justNow');
  if (diff < 3600) return translate(language, 'dates.minutesAgo', { count: Math.floor(diff / 60) });
  if (diff < 86400) return translate(language, 'dates.hoursAgo', { count: Math.floor(diff / 3600) });
  if (diff < 2592000) return translate(language, 'dates.daysAgo', { count: Math.floor(diff / 86400) });
  if (diff < 31536000) return translate(language, 'dates.monthsAgo', { count: Math.floor(diff / 2592000) });
  return translate(language, 'dates.yearsAgo', { count: Math.floor(diff / 31536000) });
}

export function formatEventDate(dateStr: string, language: LanguageCode = 'fil'): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${monthShort(language, d.getMonth())} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(dateStr: string, language: LanguageCode = 'fil'): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${monthShort(language, d.getMonth())} ${d.getDate()}`;
}

export function formatTime(timeStr: string): string {
  return timeStr;
}
