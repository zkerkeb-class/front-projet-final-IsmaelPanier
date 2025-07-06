import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState('select'); // 'select' ou 'form'
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setStep('form');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      };

      const result = await register(userData);
      
      if (result.success) {
        // Redirection vers le dashboard selon le rôle
        if (formData.role === 'restaurant') {
          navigate('/restaurant/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep('select');
    setSelectedRole('');
    setError('');
  };

  // Étape 1: Sélection du type de compte
  if (step === 'select') {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h1>🏪 Rejoignez FoodDelivery+</h1>
            <p>Choisissez votre type de compte pour commencer</p>
          </div>

          <div className="role-selection">
            <div 
              className="role-card"
              onClick={() => handleRoleSelect('user')}
            >
              <div className="role-icon">👤</div>
              <h2>Client</h2>
              <p>Je veux commander des repas</p>
              <ul className="role-features">
                <li>✓ Commandez en quelques clics</li>
                <li>✓ Suivez vos livraisons en temps réel</li>
                <li>✓ Gérez vos favoris</li>
                <li>✓ Consultez votre historique</li>
              </ul>
              <button className="btn btn-primary">
                Devenir Client
              </button>
            </div>

            <div 
              className="role-card restaurant"
              onClick={() => handleRoleSelect('restaurant')}
            >
              <div className="role-icon">🏪</div>
              <h2>Restaurant</h2>
              <p>Je veux vendre mes plats</p>
              <ul className="role-features">
                <li>✓ Gérez votre menu facilement</li>
                <li>✓ Recevez des commandes en temps réel</li>
                <li>✓ Suivez vos performances</li>
                <li>✓ Développez votre activité</li>
              </ul>
              <button className="btn btn-success">
                Devenir Restaurant
              </button>
            </div>
          </div>

          <div className="register-footer">
            <p>
              Déjà un compte ?{' '}
              <Link to="/login" className="link">
                Se connecter
              </Link>
            </p>
            <p>
              <Link to="/" className="link">
                ← Retour à l'accueil
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Étape 2: Formulaire d'inscription
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <button onClick={goBack} className="back-btn">
            ← Retour
          </button>
          <h1>
            {selectedRole === 'restaurant' ? '🏪' : '👤'} 
            Inscription {selectedRole === 'restaurant' ? 'Restaurant' : 'Client'}
          </h1>
          <p>
            {selectedRole === 'restaurant' 
              ? 'Créez votre compte restaurant et commencez à vendre vos plats'
              : 'Créez votre compte client et commencez à commander'
            }
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Répétez votre mot de passe"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Déjà un compte ?{' '}
            <Link to="/login" className="link">
              Se connecter
            </Link>
          </p>
          <p>
            <Link to="/" className="link">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 