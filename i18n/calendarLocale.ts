/**
 * Month/day names for react-native-calendars, which reads them from a global
 * LocaleConfig. I18nProvider calls setCalendarLocale() when the language changes.
 */

import { LocaleConfig } from 'react-native-calendars';
import type { LanguageCode } from '../store/countryStore';

LocaleConfig.locales.en = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

LocaleConfig.locales.fil = {
  monthNames: ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'],
  monthNamesShort: ['Ene', 'Peb', 'Mar', 'Abr', 'May', 'Hun', 'Hul', 'Ago', 'Set', 'Okt', 'Nob', 'Dis'],
  dayNames: ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'],
  dayNamesShort: ['Lin', 'Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab'],
  today: 'Ngayon',
};

export function setCalendarLocale(language: LanguageCode) {
  LocaleConfig.defaultLocale = language === 'fil' ? 'fil' : 'en';
}
