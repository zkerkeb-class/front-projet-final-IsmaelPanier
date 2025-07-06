import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { t } = useTranslation();

  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="language-selector">
      <div className="language-selector__label">
        {t('common.language')}:
      </div>
      <div className="language-selector__options">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-selector__option ${
              i18n.language === lang.code ? 'language-selector__option--active' : ''
            }`}
            onClick={() => changeLanguage(lang.code)}
            title={lang.name}
          >
            <span className="language-selector__flag">{lang.flag}</span>
            <span className="language-selector__name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector; 