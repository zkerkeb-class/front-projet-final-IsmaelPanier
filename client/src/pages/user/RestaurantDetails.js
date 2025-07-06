import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DishDetailModal from '../../components/common/DishDetailModal';
import './RestaurantDetails.css';

const API_BASE_URL = 'http://localhost:5000';

// Fonction utilitaire pour s'assurer qu'on affiche toujours du texte
const safeDisplayText = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return fallback;
};

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [showDishModal, setShowDishModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [cart, setCart] = useState([]);

  // Catégories de plats
  const categories = ['Tous', 'Entrées', 'Plats principaux', 'Desserts', 'Boissons', 'Pizza', 'Burger', 'Sushi'];

  const fetchRestaurantDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Récupérer les détails du restaurant
      const restaurantResponse = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!restaurantResponse.ok) {
        throw new Error('Restaurant non trouvé');
      }

      const restaurantData = await restaurantResponse.json();
      setRestaurant(restaurantData);

      // Récupérer les plats du restaurant
      const dishesResponse = await fetch(`${API_BASE_URL}/dishes/restaurant/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (dishesResponse.ok) {
        const dishesData = await dishesResponse.json();
        setDishes(Array.isArray(dishesData) ? dishesData : []);
      } else {
        // Si pas de plats, utiliser des données d'exemple
        const mockDishes = [
          {
            _id: '1',
            name: 'Pizza Margherita',
            description: 'Pizza classique avec tomate, mozzarella et basilic frais',
            price: 12.50,
            category: 'Pizza',
            image: '/api/placeholder/300/200',
            ingredients: ['Pâte à pizza', 'Sauce tomate', 'Mozzarella', 'Basilic frais', 'Huile d\'olive'],
            allergens: ['Gluten', 'Lactose'],
            isVegetarian: true,
            spicyLevel: 0,
            preparationTime: '15-20 min'
          },
          {
            _id: '2',
            name: 'Burger Classique',
            description: 'Burger avec steak haché, salade, tomate, cornichons et sauce spéciale',
            price: 14.90,
            category: 'Burger',
            image: '/api/placeholder/300/200',
            ingredients: ['Pain burger', 'Steak haché 150g', 'Salade', 'Tomate', 'Cornichons', 'Sauce spéciale'],
            allergens: ['Gluten', 'Œufs'],
            isVegetarian: false,
            spicyLevel: 1,
            preparationTime: '12-15 min'
          },
          {
            _id: '3',
            name: 'Salade César',
            description: 'Salade romaine, parmesan, croûtons et sauce César maison',
            price: 11.50,
            category: 'Entrées',
            image: '/api/placeholder/300/200',
            ingredients: ['Salade romaine', 'Parmesan', 'Croûtons', 'Sauce César', 'Anchois'],
            allergens: ['Gluten', 'Lactose', 'Poisson'],
            isVegetarian: false,
            spicyLevel: 0,
            preparationTime: '8-10 min'
          },
          {
            _id: '4',
            name: 'Tiramisu',
            description: 'Dessert italien traditionnel au café et mascarpone',
            price: 6.90,
            category: 'Desserts',
            image: '/api/placeholder/300/200',
            ingredients: ['Mascarpone', 'Café', 'Biscuits savoiardi', 'Cacao', 'Œufs', 'Sucre'],
            allergens: ['Gluten', 'Lactose', 'Œufs'],
            isVegetarian: true,
            spicyLevel: 0,
            preparationTime: '5 min'
          }
        ];
        setDishes(mockDishes);
      }
    } catch (err) {
      console.error('❌ Erreur chargement restaurant:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [fetchRestaurantDetails]);

  const filteredDishes = dishes.filter(dish => 
    activeCategory === 'Tous' || dish.category === activeCategory
  );

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
    setShowDishModal(true);
  };

  const closeDishModal = () => {
    setShowDishModal(false);
    setSelectedDish(null);
  };

  const addToCart = (dish, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === dish._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === dish._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...dish, quantity }];
    });
  };

  const getSpicyIcon = (level) => {
    switch(level) {
      case 0: return '';
      case 1: return '🌶️';
      case 2: return '🌶️🌶️';
      case 3: return '🌶️🌶️🌶️';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="uber-loading">
        <div className="uber-spinner"></div>
        <p>Chargement du restaurant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/user/dashboard')} className="uber-btn uber-btn-primary">
          Retour aux restaurants
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="error-page">
        <h2>Restaurant non trouvé</h2>
        <button onClick={() => navigate('/user/dashboard')} className="uber-btn uber-btn-primary">
          Retour aux restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="restaurant-details">
      {/* Header avec image du restaurant */}
      <div className="restaurant-hero">
        <div className="hero-image">
          {restaurant.image ? (
            <img src={restaurant.image} alt={restaurant.name} />
          ) : (
            <div className="hero-placeholder">
              <div className="placeholder-icon">🏪</div>
            </div>
          )}
          <div className="hero-overlay">
            <button onClick={() => navigate('/user/dashboard')} className="back-btn">
              ← Retour
            </button>
            <div className={`restaurant-status ${restaurant.isOpen !== false ? 'open' : 'closed'}`}>
              {restaurant.isOpen !== false ? 'Ouvert' : 'Fermé'}
            </div>
          </div>
        </div>
      </div>

      {/* Informations du restaurant */}
      <div className="restaurant-info-section">
        <div className="container">
          <div className="restaurant-header">
            <div className="restaurant-main-info">
              <h1 className="restaurant-name">{restaurant.name || 'Restaurant'}</h1>
              <p className="restaurant-cuisine">{restaurant.cuisine || 'Cuisine'}</p>
              <p className="restaurant-description">{restaurant.description || 'Description du restaurant'}</p>
              
              <div className="restaurant-meta">
                <div className="meta-item">
                  <span className="meta-icon">⭐</span>
                  <span className="meta-text">{safeDisplayText(restaurant.rating, '4.5')} ({safeDisplayText(restaurant.reviewCount, '127')} avis)</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🕒</span>
                  <span className="meta-text">{safeDisplayText(restaurant.deliveryTime, '25-35 min')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🚚</span>
                  <span className="meta-text">Livraison gratuite</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">💰</span>
                  <span className="meta-text">{safeDisplayText(restaurant.priceRange, 'Moyen')}</span>
                </div>
              </div>
            </div>

            <div className="restaurant-contact">
              <div className="contact-info">
                <h3>Informations</h3>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span>
                    {restaurant.address 
                      ? (typeof restaurant.address === 'string' 
                          ? restaurant.address 
                          : `${restaurant.address.street || ''}, ${restaurant.address.city || ''} ${restaurant.address.postalCode || ''}, ${restaurant.address.country || ''}`.trim())
                      : '123 Rue de la Paix, 75001 Paris'
                    }
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <span>{restaurant.phone || '01 23 45 67 89'}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">✉️</span>
                  <span>{restaurant.email || 'contact@restaurant.fr'}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <span>
                    {restaurant.openingHours?.monday 
                      ? `Lun: ${restaurant.openingHours.monday}`
                      : 'Ouvert de 11h30 à 22h30'
                    }
                  </span>
                </div>
                {restaurant.deliveryOptions && restaurant.deliveryOptions.length > 0 && (
                  <div className="info-item">
                    <span className="info-icon">🚚</span>
                    <span>{restaurant.deliveryOptions.join(', ')}</span>
                  </div>
                )}
                {restaurant.paymentMethods && restaurant.paymentMethods.length > 0 && (
                  <div className="info-item">
                    <span className="info-icon">💳</span>
                    <span>{restaurant.paymentMethods.join(', ')}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <span>Commande minimum: {restaurant.minOrderAmount || 10}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="menu-section">
        <div className="container">
          <div className="menu-header">
            <h2>Notre Menu</h2>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="dishes-grid">
            {filteredDishes.map(dish => (
              <div key={dish._id} className="dish-card" onClick={() => handleDishClick(dish)}>
                <div className="dish-image">
                  {dish.image ? (
                    <img src={dish.image} alt={dish.name} />
                  ) : (
                    <div className="dish-placeholder">
                      <span className="dish-icon">🍽️</span>
                    </div>
                  )}
                  {dish.isVegetarian && (
                    <div className="vegetarian-badge">🌱</div>
                  )}
                  {dish.spicyLevel > 0 && (
                    <div className="spicy-badge">{getSpicyIcon(dish.spicyLevel)}</div>
                  )}
                </div>
                
                <div className="dish-content">
                  <div className="dish-header">
                    <h3 className="dish-name">{safeDisplayText(dish.name, 'Plat')}</h3>
                    <span className="dish-price">{safeDisplayText(dish.price, '0')}€</span>
                  </div>
                  
                  <p className="dish-description">{safeDisplayText(dish.description, 'Description du plat')}</p>
                  
                  <div className="dish-footer">
                    <span className="preparation-time">⏱️ {safeDisplayText(dish.preparationTime, '15 min')}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dish);
                      }}
                    >
                      Ajouter +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDishes.length === 0 && (
            <div className="empty-dishes">
              <div className="empty-icon">🍽️</div>
              <h3>Aucun plat dans cette catégorie</h3>
              <p>Essayez une autre catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* Panier flottant */}
      {cart.length > 0 && (
        <div className="floating-cart">
          <div className="cart-summary">
            <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)} article(s)</span>
            <span className="cart-total">
              {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}€
            </span>
          </div>
          <button className="cart-btn">
            Voir le panier 🛒
          </button>
        </div>
      )}

      {/* Modal plat */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={showDishModal}
        onClose={closeDishModal}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default RestaurantDetails; 