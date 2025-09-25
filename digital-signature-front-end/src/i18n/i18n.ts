import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LOCALES } from '@/app/config/constants';

i18n
  // Load translations using http backend
  // Learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // Detect user language
  // Learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  // For all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: LOCALES.EN,
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: [LOCALES.EN, LOCALES.VI],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Backend options
    backend: {
      // Path to load translations from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Default namespace used if not specified
    defaultNS: 'translation',
  });

export default i18n;
