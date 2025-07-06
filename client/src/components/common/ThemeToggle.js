import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { t } = useTranslation();

  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Changer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      title={`Thème actuel: ${theme === 'light' ? t('common.light') : t('common.dark')}`}
    >
      <span className="theme-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="theme-indicator">
        {theme === 'light' ? t('common.dark') : t('common.light')}
      </span>
    </button>
  );
};

export default ThemeToggle; 