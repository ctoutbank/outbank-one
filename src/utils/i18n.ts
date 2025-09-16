import en from '../locales/en.json';
import pt from '../locales/pt.json';

// Define types for translations
interface Translations {
  [key: string]: string;
}

// Map available locales to their translations
const messages: Record<string, Translations> = {
  en,
  pt,
};

// Set default locale to Portuguese
let currentLocale: keyof typeof messages = 'pt';

/**
 * Change the current locale. Pass 'en' or 'pt'.
 */
export function setLocale(locale: keyof typeof messages) {
  if (messages[locale]) {
    currentLocale = locale;
  }
}

/**
 * Translate a given key using the current locale.
 * If the key is not found, it returns the key itself.
 */
export function t(key: string): string {
  const translation = messages[currentLocale][key];
  if (translation) {
    return translation;
  }
  return key;
}
