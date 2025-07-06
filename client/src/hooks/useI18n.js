import { useTranslation } from 'react-i18next';

/**
 * Hook personnalisé pour l'internationalisation
 * Fournit des fonctions utilitaires pour gérer les traductions
 */
export const useI18n = () => {
  const { t, i18n, ready } = useTranslation();

  /**
   * Changer de langue
   * @param {string} language - Code de la langue (fr, en, es)
   */
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  /**
   * Obtenir la langue actuelle
   * @returns {string} Code de la langue actuelle
   */
  const getCurrentLanguage = () => {
    return i18n.language;
  };

  /**
   * Vérifier si la langue est chargée
   * @returns {boolean} True si la langue est prête
   */
  const isLanguageReady = () => {
    return ready;
  };

  /**
   * Obtenir la liste des langues supportées
   * @returns {Array} Liste des langues supportées
   */
  const getSupportedLanguages = () => {
    return i18n.options.supportedLngs || ['fr', 'en', 'es'];
  };

  /**
   * Traduire avec interpolation
   * @param {string} key - Clé de traduction
   * @param {Object} options - Options d'interpolation
   * @returns {string} Texte traduit
   */
  const translate = (key, options = {}) => {
    return t(key, options);
  };

  /**
   * Traduire avec pluriel
   * @param {string} key - Clé de traduction
   * @param {number} count - Nombre pour le pluriel
   * @param {Object} options - Options supplémentaires
   * @returns {string} Texte traduit avec pluriel
   */
  const translatePlural = (key, count, options = {}) => {
    return t(key, { count, ...options });
  };

  /**
   * Traduire avec formatage de date
   * @param {string} key - Clé de traduction
   * @param {Date} date - Date à formater
   * @param {Object} options - Options de formatage
   * @returns {string} Date traduite et formatée
   */
  const translateDate = (key, date, options = {}) => {
    return t(key, { date, ...options });
  };

  /**
   * Traduire avec formatage de nombre
   * @param {string} key - Clé de traduction
   * @param {number} number - Nombre à formater
   * @param {Object} options - Options de formatage
   * @returns {string} Nombre traduit et formaté
   */
  const translateNumber = (key, number, options = {}) => {
    return t(key, { number, ...options });
  };

  /**
   * Vérifier si une clé de traduction existe
   * @param {string} key - Clé à vérifier
   * @returns {boolean} True si la clé existe
   */
  const hasTranslation = (key) => {
    return i18n.exists(key);
  };

  /**
   * Obtenir la langue par défaut
   * @returns {string} Code de la langue par défaut
   */
  const getDefaultLanguage = () => {
    return i18n.options.fallbackLng || 'fr';
  };

  /**
   * Obtenir les informations de la langue actuelle
   * @returns {Object} Informations sur la langue
   */
  const getLanguageInfo = () => {
    const currentLang = getCurrentLanguage();
    const languages = {
      fr: { name: 'Français', flag: '🇫🇷', direction: 'ltr' },
      en: { name: 'English', flag: '🇺🇸', direction: 'ltr' },
      es: { name: 'Español', flag: '🇪🇸', direction: 'ltr' }
    };
    
    return languages[currentLang] || languages.fr;
  };

  /**
   * Définir la direction du texte (LTR/RTL)
   * @param {string} direction - Direction du texte
   */
  const setTextDirection = (direction) => {
    document.documentElement.dir = direction;
  };

  /**
   * Initialiser la direction du texte selon la langue
   */
  const initializeTextDirection = () => {
    const { direction } = getLanguageInfo();
    setTextDirection(direction);
  };

  return {
    // Fonctions de base
    t: translate,
    i18n,
    ready: isLanguageReady(),
    
    // Fonctions utilitaires
    changeLanguage,
    getCurrentLanguage,
    isLanguageReady,
    getSupportedLanguages,
    translate,
    translatePlural,
    translateDate,
    translateNumber,
    hasTranslation,
    getDefaultLanguage,
    getLanguageInfo,
    setTextDirection,
    initializeTextDirection
  };
};

export default useI18n; 