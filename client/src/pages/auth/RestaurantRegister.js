import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import DishModal from '../../components/common/DishModal';
import WelcomeModal from '../../components/common/WelcomeModal';
import './RestaurantRegister.css';

const API_BASE_URL = 'http://localhost:5000';

const RestaurantRegister = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [createdRestaurantName, setCreatedRestaurantName] = useState('');

  // Données du formulaire
  const [formData, setFormData] = useState({
    restaurantName: '',
    restaurantDescription: '',
    restaurantAdress: '',
    cuisine: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Données d'authentification
  const [authData, setAuthData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Catégories de cuisine
  const cuisineTypes = [
    'Italienne',
    'Française',
    'Japonaise',
    'Chinoise',
    'Indienne',
    'Mexicaine',
    'Américaine',
    'Thaïlandaise',
    'Vietnamienne',
    'Libanaise',
    'Grecque',
    'Espagnole',
    'Autre'
  ];

  const steps = [
    { number: 1, label: 'Informations de base' },
    { number: 2, label: 'Horaires d\'ouverture' },
    { number: 3, label: t('restaurant.menu') },
    { number: 4, label: 'Compte utilisateur' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthChange = (field, value) => {
    setAuthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const openDishModal = (dish = null) => {
    setEditingDish(dish);
    setShowDishModal(true);
  };

  const closeDishModal = () => {
    setShowDishModal(false);
    setEditingDish(null);
  };

  const handleSaveDish = (dishData) => {
    if (editingDish) {
      // Modifier un plat existant
      setFormData(prev => ({
        ...prev,
        dishes: prev.dishes.map(dish => 
          dish.id === editingDish.id ? { ...dishData, id: dish.id } : dish
        )
      }));
    } else {
      // Ajouter un nouveau plat
      const newDish = {
        ...dishData,
        id: Date.now()
      };
      setFormData(prev => ({
        ...prev,
        dishes: [...prev.dishes, newDish]
      }));
    }
    closeDishModal();
  };

  const removeDish = (dishId) => {
    setFormData(prev => ({
      ...prev,
      dishes: prev.dishes.filter(dish => dish.id !== dishId)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (authData.password !== authData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Créer le compte utilisateur
      const userResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: authData.firstName,
          lastName: authData.lastName,
          email: authData.email,
          password: authData.password,
          role: 'restaurant'
        })
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'Erreur lors de la création du compte');
      }

      const userData = await userResponse.json();

      // 2. Se connecter pour obtenir le token
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: authData.email,
          password: authData.password
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Erreur lors de la connexion');
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      // 3. Créer le restaurant
      const restaurantResponse = await fetch(`${API_BASE_URL}/restaurant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          cuisine: formData.cuisine,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          priceRange: formData.priceRange,
          openingHours: formData.openingHours,
          owner: userData.user._id
        })
      });

      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json();
        throw new Error(errorData.message || 'Erreur lors de la création du restaurant');
      }

      const restaurantData = await restaurantResponse.json();

      // 4. Ajouter les plats
      if (formData.dishes.length > 0) {
        for (const dish of formData.dishes) {
          const dishResponse = await fetch(`${API_BASE_URL}/dishes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ...dish,
              restaurant: restaurantData._id
            })
          });

          if (!dishResponse.ok) {
            console.warn(`Erreur lors de l'ajout du plat ${dish.name}`);
          }
        }
      }

      // 5. Afficher le modal de bienvenue
      setCreatedRestaurantName(formData.name);
      setShowWelcomeModal(true);

    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowWelcomeModal(false);
    navigate('/restaurant/dashboard');
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h2>Informations du restaurant</h2>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Nom du restaurant *</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ex: Pizza Palace"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cuisine">Type de cuisine *</label>
          <select
            id="cuisine"
            value={formData.cuisine}
            onChange={(e) => handleInputChange('cuisine', e.target.value)}
            required
          >
            <option value="">Sélectionnez une cuisine</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">{t('restaurant.description')}</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Décrivez votre restaurant, vos spécialités..."
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Téléphone *</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+33 1 23 45 67 89"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contact@restaurant.fr"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Adresse complète *</label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="123 Rue de la Paix, 75001 Paris"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="priceRange">Gamme de prix</label>
        <select
          id="priceRange"
          value={formData.priceRange}
          onChange={(e) => handleInputChange('priceRange', e.target.value)}
        >
          <option value="low">€ (Économique)</option>
          <option value="medium">€€ (Moyen)</option>
          <option value="high">€€€ (Haut de gamme)</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h2>Horaires d'ouverture</h2>
      
      <div className="opening-hours-section">
        <h3>Définissez vos horaires de service</h3>
        
        <div className="opening-hours-grid">
          {Object.entries(formData.openingHours).map(([day, hours]) => (
            <div key={day} className="day-hours">
              <span className="day-label">
                {day === 'monday' && 'Lundi'}
                {day === 'tuesday' && 'Mardi'}
                {day === 'wednesday' && 'Mercredi'}
                {day === 'thursday' && 'Jeudi'}
                {day === 'friday' && 'Vendredi'}
                {day === 'saturday' && 'Samedi'}
                {day === 'sunday' && 'Dimanche'}
              </span>
              
              <div className="hours-inputs">
                <input
                  type="time"
                  value={hours.open}
                  onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                />
                <span>à</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h2>Menu du restaurant</h2>
      
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#718096' }}>
        Ajoutez vos plats principaux avec images. Vous pourrez en ajouter d'autres après l'inscription.
      </p>

      {formData.dishes.length === 0 ? (
        <div className="empty-dishes">
          <div className="empty-dishes-icon">🍽️</div>
          <h3>Aucun plat ajouté</h3>
          <p>Commencez par ajouter votre premier plat pour créer votre menu</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openDishModal()}
          >
            + Ajouter mon premier plat
          </button>
        </div>
      ) : (
        <div className="dishes-list">
          {formData.dishes.map((dish, index) => (
            <div key={dish.id} className="dish-card">
              <div className="dish-card-header">
                <div className="dish-info">
                  <h3>{dish.name || `Plat ${index + 1}`}</h3>
                  <span className="dish-category">{dish.category}</span>
                  {dish.basePrice && (
                    <span className="dish-price">{dish.basePrice}€</span>
                  )}
                </div>
                <div className="dish-actions">
                  <button
                    type="button"
                    className="btn-edit-dish"
                    onClick={() => openDishModal(dish)}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    type="button"
                    className="btn-remove-dish"
                    onClick={() => removeDish(dish.id)}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
              
              {dish.description && (
                <p className="dish-description">{dish.description}</p>
              )}
              
              {dish.images && dish.images.length > 0 && (
                <div className="dish-images">
                  {dish.images.slice(0, 3).map((image, imgIndex) => (
                    <div key={imgIndex} className="dish-image">
                      <img src={image.url} alt={image.alt || dish.name} />
                      {image.isMain && <span className="main-badge">Principal</span>}
                    </div>
                  ))}
                  {dish.images.length > 3 && (
                    <div className="more-images">
                      +{dish.images.length - 3} autres
                    </div>
                  )}
                </div>
              )}
              
              <div className="dish-status">
                <span className={`status-badge ${dish.isAvailable ? 'available' : 'unavailable'}`}>
                  {dish.isAvailable ? '✅ Disponible' : '❌ Indisponible'}
                </span>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            className="btn btn-outline add-dish-btn"
            onClick={() => openDishModal()}
          >
            + Ajouter un autre plat
          </button>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h2>Compte utilisateur</h2>
      
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#718096' }}>
        Créez votre compte pour gérer votre restaurant
      </p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            value={authData.firstName}
            onChange={(e) => handleAuthChange('firstName', e.target.value)}
            placeholder="Votre prénom"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Nom *</label>
          <input
            type="text"
            id="lastName"
            value={authData.lastName}
            onChange={(e) => handleAuthChange('lastName', e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="authEmail">Email *</label>
        <input
          type="email"
          id="authEmail"
          value={authData.email}
          onChange={(e) => handleAuthChange('email', e.target.value)}
          placeholder="votre.email@exemple.com"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password">Mot de passe *</label>
          <input
            type="password"
            id="password"
            value={authData.password}
            onChange={(e) => handleAuthChange('password', e.target.value)}
            placeholder="Minimum 6 caractères"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
          <input
            type="password"
            id="confirmPassword"
            value={authData.confirmPassword}
            onChange={(e) => handleAuthChange('confirmPassword', e.target.value)}
            placeholder="Répétez votre mot de passe"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="restaurant-register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>🏪 Inscription Restaurant</h1>
          <p>Rejoignez notre plateforme et développez votre activité</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''}`}>
              <div className="step-number">{step.number}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <div className="register-form">
          {renderCurrentStep()}

          {/* Actions */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Précédent
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Création en cours...' : 'Créer mon restaurant'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="register-footer">
          <p>
            Vous avez déjà un compte ?{' '}
            <Link to="/auth/login">{t('auth.loginButton')}</Link>
          </p>
        </div>
      </div>

      {showDishModal && (
        <DishModal
          isOpen={showDishModal}
          onClose={closeDishModal}
          onSave={handleSaveDish}
          dish={editingDish}
        />
      )}

      {showWelcomeModal && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleGoToDashboard}
          restaurantName={createdRestaurantName}
        />
      )}
    </div>
  );
};

export default RestaurantRegister; 