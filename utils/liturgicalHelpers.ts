import { Colors } from '../constants/Colors';
import { translate } from '../i18n';
import type { LanguageCode } from '../store/countryStore';

type LiturgicalEntry = {
  season: string;
  startDate: string;
  endDate: string;
  name: string;
};

export function getCurrentSeason(calendar: LiturgicalEntry[]): LiturgicalEntry | null {
  const today = new Date().toISOString().split('T')[0];
  return calendar.find((c) => today >= c.startDate && today <= c.endDate) ?? null;
}

export function isFastingDay(calendar: LiturgicalEntry[]): boolean {
  const season = getCurrentSeason(calendar);
  if (!season) return false;
  const day = new Date().getDay();
  // Ash Wednesday (Wed) and Good Friday (Fri) during Lent, or any Friday in Lent
  if (season.season === 'lent' && (day === 3 || day === 5)) return true;
  return false;
}

export function isAbstinenceDay(calendar: LiturgicalEntry[]): boolean {
  const day = new Date().getDay();
  if (day === 5) return true; // Every Friday
  return isFastingDay(calendar);
}

export function getLiturgicalSeasonColor(season: string): string {
  switch (season) {
    case 'advent':
    case 'lent':
      return Colors.lent;
    case 'christmas':
    case 'easter':
      return Colors.gold;
    case 'pentecost':
      return Colors.crimson;
    case 'ordinary':
    default:
      return Colors.sage;
  }
}

export function getLiturgicalSeasonBg(season: string): string {
  switch (season) {
    case 'advent':
      return Colors.advent;
    case 'lent':
      return Colors.lent;
    case 'christmas':
      return Colors.gold;
    case 'easter':
      return Colors.goldLight;
    case 'pentecost':
      return Colors.crimson;
    case 'ordinary':
    default:
      return Colors.sage;
  }
}

export function formatFilipinoDate(date: Date = new Date(), language: LanguageCode = 'fil'): string {
  const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return translate(language, 'dates.longDate', {
    weekday: translate(language, `massSchedule.${DAY_KEYS[date.getDay()]}`),
    day: date.getDate(),
    month: translate(language, `dates.months.${MONTH_KEYS[date.getMonth()]}`),
    year: date.getFullYear(),
  });
}

export function getUpcomingFeasts(daysAhead = 30): { date: string; name: string; rank: string }[] {
  const feasts: { date: string; name: string; rank: string }[] = [
    { date: '2025-03-19', name: 'Kapistahan ni San Jose', rank: 'Solemnity' },
    { date: '2025-03-25', name: 'Annunciation of the Lord', rank: 'Solemnity' },
    { date: '2025-04-20', name: 'Easter Sunday', rank: 'Solemnity' },
    { date: '2025-05-01', name: 'Saint Joseph the Worker', rank: 'Optional Memorial' },
    { date: '2025-05-31', name: 'Visitation of the Blessed Virgin Mary', rank: 'Feast' },
    { date: '2025-06-08', name: 'Pentecost Sunday', rank: 'Solemnity' },
    { date: '2025-06-19', name: 'Corpus Christi', rank: 'Solemnity' },
    { date: '2025-08-15', name: 'Assumption of Mary', rank: 'Solemnity' },
    { date: '2025-11-01', name: 'All Saints Day', rank: 'Solemnity' },
    { date: '2025-11-02', name: 'All Souls Day', rank: 'Commemoration' },
    { date: '2025-12-08', name: 'Immaculate Conception', rank: 'Solemnity' },
    { date: '2025-12-25', name: 'Pasko ng Kapanganakan', rank: 'Solemnity' },
  ];

  const today = new Date();
  const limit = new Date(today.getTime() + daysAhead * 86400000);
  const todayStr = today.toISOString().split('T')[0];
  const limitStr = limit.toISOString().split('T')[0];

  return feasts.filter((f) => f.date >= todayStr && f.date <= limitStr);
}

export function getMarkedDates(feasts: { date: string; rank: string }[]): Record<string, any> {
  const marked: Record<string, any> = {};
  feasts.forEach((f) => {
    const dotColor =
      f.rank === 'Solemnity' ? Colors.gold :
      f.rank === 'Feast' ? Colors.navy :
      Colors.crimson;
    marked[f.date] = {
      marked: true,
      dotColor,
    };
  });
  return marked;
}

const RANK_KEYS: Record<string, string> = {
  'Solemnity': 'liturgical.ranks.solemnity',
  'Feast': 'liturgical.ranks.feast',
  'Memorial': 'liturgical.ranks.memorial',
  'Optional Memorial': 'liturgical.ranks.optionalMemorial',
  'Commemoration': 'liturgical.ranks.commemoration',
};

/** Translated display label for a feast rank; unknown ranks are returned as-is. */
export function formatRank(rank: string, t: (key: string) => string): string {
  const key = RANK_KEYS[rank];
  return key ? t(key) : rank;
}

const SEASON_KEYS = ['advent', 'lent', 'christmas', 'easter', 'pentecost', 'ordinary'];

/** Translated "<Season> Time" label; unknown seasons fall back to "<SEASON> TIME". */
export function formatSeasonTime(season: string, t: (key: string) => string): string {
  return SEASON_KEYS.includes(season)
    ? t(`liturgical.seasonTime.${season}`)
    : `${season.toUpperCase()} TIME`;
}
