/**
 * Lightweight i18n system — zero external dependencies.
 *
 * Follows the same Context + hook pattern as ThemeContext.
 * Reacts to language changes from countryStore automatically.
 *
 * Usage:
 *   const { t } = useI18n();
 *   t('home.greeting')          → "Good morning"
 *   t('common.save')            → "Save"
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useCountryStore } from '../store/countryStore';
import type { LanguageCode } from '../store/countryStore';
import { setCalendarLocale } from './calendarLocale';

// — Static locale imports (bundled at build time, no async loading) —
import en from './locales/en.json';
import fil from './locales/fil.json';
import hi from './locales/hi.json';

// ─── Types ────────────────────────────────────────────────────────────────────

type LocaleTree = typeof en;

// Produces all valid dot-notation key paths, e.g. 'home.greeting' | 'common.save'
type DotPath<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotPath<T[K], P extends '' ? `${string & K}` : `${P}.${string & K}`>
    : P extends ''
    ? `${string & K}`
    : `${P}.${string & K}`;
}[keyof T];

export type TranslationKey = DotPath<LocaleTree>;

// ─── Locale map ───────────────────────────────────────────────────────────────

const LOCALES: Record<LanguageCode, LocaleTree> = {
  en,
  // fil omits the English-only '_one' singular keys; lookups fall back per key
  fil: fil as unknown as LocaleTree,
  // hi shares the same shape; cast is safe because we validated keys match
  hi: hi as unknown as LocaleTree,
  // te / ta fall back to English until translation files are added
  te: en,
  ta: en,
};

// ─── Resolver ─────────────────────────────────────────────────────────────────

/**
 * Resolves a dot-notation key against a nested locale object.
 * Returns undefined if not found.
 */
function lookup(obj: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/** Replaces {{name}} placeholders with values from params. */
function interpolate(str: string, params?: TranslationParams): string {
  if (!params) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    params[name] !== undefined ? String(params[name]) : match,
  );
}

export type TranslationParams = Record<string, string | number>;

/**
 * Translate against a specific language, outside React (e.g. Alert text in
 * callbacks is fine with the hook, but stores/utils can use this).
 * Falls back to English, then to the key itself (visible in UI = easy to spot).
 */
export function translate(
  language: LanguageCode,
  key: TranslationKey | string,
  params?: TranslationParams,
): string {
  const locale = (LOCALES[language] ?? en) as unknown as Record<string, unknown>;
  const fallback = en as unknown as Record<string, unknown>;
  const pick = (tree: Record<string, unknown>): string | undefined =>
    // Singular form: when params.count === 1, prefer '<key>_one' if this locale has it.
    (params?.count === 1 ? lookup(tree, `${key}_one`) : undefined) ?? lookup(tree, key);
  const value = pick(locale) ?? pick(fallback) ?? key;
  return interpolate(value, params);
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface I18nContextValue {
  /** Translate a dot-notation key: t('home.greeting'), t('home.hello', { name }) */
  t: (key: TranslationKey | string, params?: TranslationParams) => string;
  /** Current active language code */
  language: LanguageCode;
  /** Switch and persist the app language */
  setLanguage: (code: LanguageCode) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue>({
  t: (key, params) => translate('fil', key, params),
  language: 'fil',
  setLanguage: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useCountryStore((s) => s.language);
  const setLanguage = useCountryStore((s) => s.setLanguage);

  // Set synchronously so calendars rendered in this pass use the right names.
  setCalendarLocale(language);

  const t = useCallback(
    (key: TranslationKey | string, params?: TranslationParams): string =>
      translate(language, key, params),
    [language],
  );

  const value = useMemo(() => ({ t, language, setLanguage }), [t, language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
