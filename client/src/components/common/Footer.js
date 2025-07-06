import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🍕 FoodDelivery+</h3>
          <p>Votre plateforme de livraison de nourriture préférée</p>
          <div className="social-links">
            <button className="social-link" title="Facebook">📘</button>
            <button className="social-link" title="Twitter">🐦</button>
            <button className="social-link" title="Instagram">📷</button>
            <button className="social-link" title="LinkedIn">💼</button>
          </div>
        </div>

        <div className="footer-section">
          <h4>Liens rapides</h4>
          <ul className="footer-links">
            <li><Link to="/">{t('navigation.home')}</Link></li>
            <li><Link to="/about">{t('navigation.about')}</Link></li>
            <li><Link to="/contact">{t('navigation.contact')}</Link></li>
            <li><Link to="/user/restaurants">{t('restaurant.restaurants')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('common.support')}</h4>
          <ul className="footer-links">
            <li><Link to="/contact">{t('common.help')}</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
            <li><Link to="/contact">Partenariat</Link></li>
            <li><Link to="/contact">Signalement</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Informations</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Conditions d'utilisation</Link></li>
            <li><Link to="/contact">Politique de confidentialité</Link></li>
            <li><Link to="/contact">Mentions légales</Link></li>
            <li><Link to="/contact">Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} FoodDelivery+. Tous droits réservés.</p>
        <p>Développé avec ❤️ par Ismael Panier</p>
      </div>
    </footer>
  );
};

export default Footer; 