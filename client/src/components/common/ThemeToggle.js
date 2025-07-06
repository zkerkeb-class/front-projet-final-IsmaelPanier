import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Changer vers le thème ${theme === 'light' ? 'sombre' : 'clair'}`}
      title={`Thème actuel: ${theme === 'light' ? 'Clair' : 'Sombre'}`}
    >
      <span className="theme-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="theme-indicator">
        {theme === 'light' ? 'Sombre' : 'Clair'}
      </span>
    </button>
  );
};

export default ThemeToggle; 