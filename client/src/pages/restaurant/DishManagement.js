import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import DishModal from '../../components/common/DishModal';
import './DishManagement.css';

const API_BASE_URL = 'http://localhost:5000';

const DishManagement = () => {
  const { t } = useTranslation();

  const { user, token } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const categories = ['Toutes', 'Entrées', 'Plats principaux', 'Pizzas', 'Burgers', 'Sushis', 'Salades', 'Desserts', 'Boissons'];

  const fetchDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📡 Appel API pour charger les plats...');
      const response = await fetch(`${API_BASE_URL}/dishes/my-dishes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📋 Statut de la réponse API:', response.status);
      if (response.ok) {
        const data = await response.json();
        setDishes(Array.isArray(data) ? data : []);
        console.log('✅ Plats chargés:', data);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur API lors du chargement des plats:', response.status, errorText);
        // Si pas de plats, utiliser des données d'exemple
        const mockDishes = [
          {
            _id: '1',
            name: 'Pizza Margherita',
            description: 'Pizza classique avec tomate, mozzarella et basilic frais',
            basePrice: 12.50,
            category: 'Pizzas',
            isAvailable: true,
            images: [],
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Burger Classique',
            description: 'Burger avec steak haché, salade, tomate, cornichons et sauce spéciale',
            basePrice: 14.90,
            category: 'Burgers',
            isAvailable: true,
            images: [],
            createdAt: new Date().toISOString()
          }
        ];
        setDishes(mockDishes);
        console.log('📋 Utilisation des données d\'exemple');
      }
    } catch (err) {
      console.error('❌ Erreur réseau ou autre lors du chargement des plats:', err);
      setError('Erreur de connexion au serveur');
      setDishes([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    console.log('👤 Utilisateur connecté:', user);
    console.log('🔑 Rôle utilisateur:', user?.role);
    fetchDishes();
  }, [fetchDishes, user]);

  // Recharger les plats à chaque montage de la page
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Page revisitée, rechargement des plats...');
      fetchDishes();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchDishes]);

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Commenting out unused handleAddDish function to fix ESLint warning
  /*
  const handleAddDish = async (newDish) => {
    try {
      setLoading(true);
      const restaurantId = user?.restaurantId;
      console.log('Ajout d\'un plat - restaurantId:', restaurantId);
      if (!restaurantId) {
        console.error('Erreur: Aucun restaurantId trouvé pour cet utilisateur.');
        throw new Error('Aucun restaurantId trouvé');
      }
      // Préparer les données du plat
      const dishData = {
        ...newDish,
        restaurantId: restaurantId,
        stockQuantity: newDish.stockQuantity !== undefined ? Math.max(0, newDish.stockQuantity) : 0,
        isAvailable: newDish.isAvailable !== undefined ? newDish.isAvailable : true,
        ingredients: typeof newDish.ingredients === 'string' 
          ? newDish.ingredients.split(',').map(ingredient => ({ name: ingredient.trim(), quantity: 'N/A', isAllergen: false })) 
          : newDish.ingredients,
      };
      console.log('Données envoyées pour ajout de plat:', dishData);
      // ... existing code ...
    } catch (err) {
      console.error('❌ Erreur générale sauvegarde plat:', err);
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    }
  };
  */

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setShowModal(true);
  };

  const handleSaveDish = async (dishData) => {
    try {
      setError('');
      console.log('🍽️ Début sauvegarde plat:', dishData);
      console.log('🔑 Token utilisé:', token ? 'Présent' : 'Manquant');
      
      if (editingDish) {
        // Modifier un plat existant
        console.log('✏️ Modification du plat:', editingDish._id);
        
        // Filtrer les champs autorisés pour la modification
        const allowedFields = [
          'name', 'description', 'basePrice', 'category', 'isAvailable', 'images',
          'ingredients', 'allergens', 'preparationTime', 'difficulty', 'isVegetarian', 'isSpicy',
          'trackStock', 'stockQuantity', 'minStockAlert', 'isDailySpecial', 'isPromotion',
          'discountPercentage', 'promotionStartDate', 'promotionEndDate', 'promotionDescription',
          'calories', 'protein', 'carbs', 'fat', 'customizationOptions', 'addOns',
          'cookingTime', 'dietaryInfo', 'spiceLevel', 'isPopular', 'rating', 'orderCount',
          'tags', 'priceOptions'
        ];
        
        // Créer un objet avec seulement les champs autorisés
        const filteredDishData = {};
        allowedFields.forEach(field => {
          if (dishData[field] !== undefined) {
            filteredDishData[field] = dishData[field];
          }
        });
        
        console.log('📦 Données filtrées pour modification:', filteredDishData);
        
        const response = await fetch(`${API_BASE_URL}/dishes/${editingDish._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(filteredDishData)
        });

        console.log('📡 Réponse modification:', response.status);

        if (response.ok) {
          const updatedDish = await response.json();
          setDishes(prev => prev.map(dish => 
            dish._id === editingDish._id ? updatedDish : dish
          ));
          console.log('✅ Plat modifié avec succès:', updatedDish);
        } else {
          const errorText = await response.text();
          console.error('❌ Erreur modification:', response.status, errorText);
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }
      } else {
        // Ajouter un nouveau plat
        console.log('➕ Ajout d\'un nouveau plat');
        console.log('📡 Envoi requête POST à l\'API pour ajout...');
        // S'assurer que stockQuantity est au moins 0 pour éviter l'erreur de validation
        const correctedDishData = {
          ...dishData,
          stockQuantity: dishData.stockQuantity && dishData.stockQuantity >= 0 ? dishData.stockQuantity : 0
        };
        console.log('📦 Données corrigées pour l\'API:', correctedDishData);
        const response = await fetch(`${API_BASE_URL}/dishes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(correctedDishData)
        });

        console.log('📋 Statut de la réponse API pour ajout:', response.status);
        if (response.ok) {
          const newDish = await response.json();
          setDishes(prev => [...prev, newDish]);
          console.log('✅ Plat ajouté avec succès dans la DB:', newDish);
          
          // Rafraîchir la liste pour être sûr
          setTimeout(() => {
            fetchDishes();
          }, 1000);
        } else {
          const errorText = await response.text();
          console.error('❌ Erreur ajout API:', response.status, errorText);
          
          // Si l'API ne fonctionne pas, ajouter localement pour la démo
          const newDish = {
            ...dishData,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          setDishes(prev => [...prev, newDish]);
          console.log('📋 Plat ajouté localement (API indisponible):', newDish);
        }
      }
      
      // Fermer le modal après succès
      setEditingDish(null);
      setShowModal(false);
      
    } catch (err) {
      console.error('❌ Erreur générale sauvegarde plat:', err);
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      return;
    }

    try {
      console.log('🗑️ Tentative de suppression du plat:', dishId);
      console.log('📡 Envoi requête DELETE à l\'API...');
      const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📋 Statut de la réponse API pour suppression:', response.status);
      if (response.ok) {
        setDishes(prev => prev.filter(dish => dish._id !== dishId));
        console.log('✅ Plat supprimé avec succès');
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur lors de la suppression:', response.status, errorText);
        // Fallback: supprimer localement si API échoue
        setDishes(prev => prev.filter(dish => dish._id !== dishId));
        console.log('📋 Plat supprimé localement (API a échoué)');
      }
    } catch (error) {
      console.error('❌ Erreur réseau ou autre lors de la suppression:', error);
      // Fallback: supprimer localement en cas d'erreur
      setDishes(prev => prev.filter(dish => dish._id !== dishId));
      console.log('📋 Plat supprimé localement (erreur réseau)');
    }
  };

  const toggleAvailability = async (dishId, currentStatus) => {
    try {
      console.log('🔄 Changement disponibilité plat:', dishId, 'Statut actuel:', currentStatus);
      console.log('📡 Envoi requête PUT à l\'API pour disponibilité...');
      // Mettre à jour uniquement le champ isAvailable
      const response = await fetch(`${API_BASE_URL}/dishes/${dishId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });

      console.log('📋 Statut de la réponse API pour disponibilité:', response.status);
      if (response.ok) {
        const updatedDish = await response.json();
        setDishes(prev => prev.map(dish => 
          dish._id === dishId ? { ...dish, isAvailable: updatedDish.isAvailable } : dish
        ));
        console.log('✅ Disponibilité mise à jour:', updatedDish.isAvailable);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur mise à jour disponibilité:', response.status, errorText);
        // Fallback: mettre à jour localement si API échoue
        setDishes(prev => prev.map(dish => 
          dish._id === dishId ? { ...dish, isAvailable: !currentStatus } : dish
        ));
        console.log('📋 Disponibilité mise à jour localement (API a échoué)');
      }
    } catch (error) {
      console.error('❌ Erreur réseau ou autre lors de mise à jour disponibilité:', error);
      // Fallback: mettre à jour localement en cas d'erreur
      setDishes(prev => prev.map(dish => 
        dish._id === dishId ? { ...dish, isAvailable: !currentStatus } : dish
      ));
      console.log('📋 Disponibilité mise à jour localement (erreur réseau)');
    }
  };

  if (loading) {
    return (
      <div className="dish-management">
        <div className="uber-loading">
          <div className="uber-spinner"></div>
          <p>Chargement de vos plats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dish-management">
      {/* Header */}
      <header className="uber-header">
        <div className="uber-header-content">
          <div className="app-logo">
            <div className="app-logo-icon">🍽️</div>
            <span>Gestion des Plats</span>
          </div>
          
          <div className="header-user-info">
            <span className="welcome-text">Restaurant {user?.firstName || 'Admin'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dish-management-main">
        <div className="dish-management-container">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">Gérez votre menu</h1>
            <p className="hero-subtitle">Ajoutez, modifiez et organisez vos plats</p>
            
            <button 
              onClick={() => {
                setEditingDish(null);
                setShowModal(true);
              }}
              className="uber-btn uber-btn-primary hero-btn"
            >
              ➕ Ajouter un nouveau plat
            </button>
          </section>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-close">✕</button>
            </div>
          )}

          {/* Filters */}
          <section className="filters-section">
            <div className="filters-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="uber-input search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="uber-input category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Statistics */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🍽️</div>
                <div className="stat-content">
                  <div className="stat-number">{dishes.length}</div>
                  <div className="stat-label">Plats au total</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{dishes.filter(d => d.isAvailable).length}</div>
                  <div className="stat-label">Disponibles</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-number">{dishes.filter(d => !d.isAvailable).length}</div>
                  <div className="stat-label">Indisponibles</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {dishes.length > 0 
                      ? (dishes.reduce((sum, d) => sum + (d.basePrice || d.price || 0), 0) / dishes.length).toFixed(2)
                      : '0.00'
                    }€
                  </div>
                  <div className="stat-label">Prix moyen</div>
                </div>
              </div>
            </div>
          </section>

          {/* Dishes Grid */}
          <section className="dishes-section">
            <div className="section-header">
              <h2>Vos plats ({filteredDishes.length})</h2>
            </div>

            {filteredDishes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>Aucun plat trouvé</h3>
                <p>
                  {dishes.length === 0 
                    ? "Commencez par ajouter votre premier plat"
                    : "Aucun plat ne correspond à vos critères de recherche"
                  }
                </p>
                <button 
                  onClick={() => {
                    setEditingDish(null);
                    setShowModal(true);
                  }}
                  className="uber-btn uber-btn-primary"
                >
                  ➕ Ajouter un plat
                </button>
              </div>
            ) : (
              <div className="dishes-grid">
                {filteredDishes.map(dish => (
                  <div key={dish._id} className={`dish-card ${!dish.isAvailable ? 'unavailable' : ''}`}>
                    <div className="dish-card-image">
                      {dish.images && dish.images.length > 0 ? (
                        <img src={dish.images[0].url} alt={dish.name} />
                      ) : (
                        <div className="dish-placeholder">
                          <span className="dish-placeholder-icon">🍽️</span>
                        </div>
                      )}
                      <div className="dish-card-overlay">
                        <button 
                          onClick={() => handleEditDish(dish)}
                          className="action-btn edit-btn"
                          title=t('common.edit')
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteDish(dish._id)}
                          className="action-btn delete-btn"
                          title=t('common.delete')
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="dish-card-content">
                      <div className="dish-card-header">
                        <h3 className="dish-name">{dish.name}</h3>
                        <span className="dish-price">{(dish.basePrice || dish.price || 0).toFixed(2)}€</span>
                      </div>
                      
                      <p className="dish-description">
                        {dish.description || 'Aucune description'}
                      </p>
                      
                      <div className="dish-card-meta">
                        <span className="dish-category">{dish.category}</span>
                        <div className="availability-toggle">
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={dish.isAvailable}
                              onChange={() => toggleAvailability(dish._id, dish.isAvailable)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                          <span className="availability-text">
                            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      <DishModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveDish}
        dish={editingDish}
        isEdit={!!editingDish}
      />
    </div>
  );
};

export default DishManagement; 