import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Charge les traductions depuis le dossier public/locales
  .use(Backend)
  // Détecte automatiquement la langue du navigateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialise i18next
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React fait déjà l'échappement
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    // Langues supportées
    supportedLngs: ['fr', 'en', 'es'],

    // Namespace par défaut
    defaultNS: 'translation',

    // Namespaces
    ns: ['translation'],
  });

export default i18n; 