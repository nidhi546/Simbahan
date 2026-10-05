/**
 * countryStore — country + language selection with AsyncStorage persistence.
 *
 * Mirrors the authStore pattern exactly (hydrate() called at app start).
 *
 * FEATURE FLAG
 * ────────────
 * Set ENABLE_COUNTRY_SELECTION = false to skip the country selection screen
 * and default to Philippines / Filipino for all users.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Feature flag ─────────────────────────────────────────────────────────────

/** Set to false to bypass country selection and default to Philippines. */
export const ENABLE_COUNTRY_SELECTION = false;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CountryCode = 'PH' | 'IN';

export type LanguageCode = 'en' | 'fil' | 'hi' | 'te' | 'ta';

export type LanguageOption = {
  code: LanguageCode;
  /** Display name in the language itself (e.g. "हिन्दी" for Hindi) */
  nativeName: string;
  /** Display name in English */
  englishName: string;
};

export type CountryConfig = {
  code: CountryCode;
  name: string;
  flag: string;
  defaultLanguage: LanguageCode;
  availableLanguages: LanguageOption[];
};

// ─── Country config ───────────────────────────────────────────────────────────

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  PH: {
    code: 'PH',
    name: 'Philippines',
    flag: '🇵🇭',
    defaultLanguage: 'fil',
    availableLanguages: [
      { code: 'fil', nativeName: 'Filipino', englishName: 'Filipino' },
      { code: 'en',  nativeName: 'English',  englishName: 'English'  },
    ],
  },
  // IN: {
  //   code: 'IN',
  //   name: 'India',
  //   flag: '🇮🇳',
  //   defaultLanguage: 'en',
  //   availableLanguages: [
  //     { code: 'en', nativeName: 'English',  englishName: 'English'  },
  //     { code: 'hi', nativeName: 'हिन्दी',   englishName: 'Hindi'    },
  //     { code: 'te', nativeName: 'తెలుగు',    englishName: 'Telugu'   },
  //     { code: 'ta', nativeName: 'தமிழ்',    englishName: 'Tamil'    },
  //   ],
  // },
};

// ─── AsyncStorage keys ────────────────────────────────────────────────────────

const KEY_COUNTRY  = '@simbahan_country';
const KEY_LANGUAGE = '@simbahan_language';

// ─── Store type ───────────────────────────────────────────────────────────────

type CountryState = {
  /** null = not yet selected (triggers country-select screen) */
  country: CountryCode | null;
  language: LanguageCode;
  isHydrated: boolean;

  /**
   * Persist country selection and reset language to country default.
   * Called from country-select screen.
   */
  setCountry: (code: CountryCode) => Promise<void>;

  /**
   * Persist language selection independently of country.
   * Called from language-select screen and settings.
   */
  setLanguage: (code: LanguageCode) => Promise<void>;

  /**
   * Load persisted country + language on app start.
   * Call alongside authStore.hydrate() in _layout.tsx.
   */
  hydrate: () => Promise<void>;

  /**
   * Clear country + language from storage — forces country-select screen
   * on next app open. Used from Settings > Change Country.
   */
  reset: () => Promise<void>;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCountryStore = create<CountryState>((set) => ({
  country: null,
  language: 'fil',
  isHydrated: false,

  setCountry: async (code) => {
    const config = COUNTRIES[code];
    const defaultLang = config.defaultLanguage;
    await AsyncStorage.multiSet([
      [KEY_COUNTRY, code],
      [KEY_LANGUAGE, defaultLang],
    ]);
    set({ country: code, language: defaultLang });
  },

  setLanguage: async (code) => {
    await AsyncStorage.setItem(KEY_LANGUAGE, code);
    set({ language: code });
  },

  hydrate: async () => {
    const [countryRaw, languageRaw] = await Promise.all([
      AsyncStorage.getItem(KEY_COUNTRY),
      AsyncStorage.getItem(KEY_LANGUAGE),
    ]);

    const language = (languageRaw as LanguageCode | null) ?? 'fil';

    // If country selection is disabled, always default to Philippines,
    // but keep the user's saved language choice.
    if (!ENABLE_COUNTRY_SELECTION) {
      const phLanguage = COUNTRIES.PH.availableLanguages.some((l) => l.code === language)
        ? language
        : COUNTRIES.PH.defaultLanguage;
      set({ country: 'PH', language: phLanguage, isHydrated: true });
      return;
    }

    const country  = (countryRaw  as CountryCode  | null) ?? null;

    set({ country, language, isHydrated: true });
  },

  reset: async () => {
    await AsyncStorage.multiRemove([KEY_COUNTRY, KEY_LANGUAGE]);
    set({ country: null, language: 'fil', isHydrated: true });
  },
}));
