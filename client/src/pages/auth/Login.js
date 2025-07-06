import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirection selon le rôle
        if (result.user.role === 'restaurant') {
          navigate('/restaurant/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="login-form">
          <h2>{t('auth.loginTitle')}</h2>
          <p>{t('auth.loginTitle')}</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="material-icons">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="material-icons">email</span>
              {t('auth.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@exemple.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span className="material-icons">lock</span>
              {t('auth.password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.password')}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? t('common.loading') : t('auth.loginButton')}
          </button>
        </form>

        <div className="form-footer">
          <p>
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="link">
              {t('auth.register')}
            </Link>
          </p>
          <p>
            <Link to="/" className="link">
              <span className="material-icons">arrow_back</span>
              {t('common.back')} {t('navigation.home')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 