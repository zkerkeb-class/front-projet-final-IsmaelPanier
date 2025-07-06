import React, { useState } from 'react';
import './DishDetailModal.css';

const DishDetailModal = ({ dish, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Extras disponibles (à personnaliser selon le type de plat)
  const availableExtras = [
    { id: 'cheese', name: 'Fromage supplémentaire', price: 1.50 },
    { id: 'bacon', name: 'Bacon', price: 2.00 },
    { id: 'avocado', name: 'Avocat', price: 2.50 },
    { id: 'sauce', name: 'Sauce supplémentaire', price: 0.50 },
    { id: 'fries', name: 'Frites en plus', price: 3.00 },
    { id: 'drink', name: 'Boisson', price: 2.50 }
  ];

  const handleExtraToggle = (extra) => {
    setSelectedExtras(prev => {
      const isSelected = prev.find(item => item.id === extra.id);
      if (isSelected) {
        return prev.filter(item => item.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const calculateTotal = () => {
    if (!dish) return 0;
    const basePrice = dish.price * quantity;
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0) * quantity;
    return basePrice + extrasPrice;
  };

  const handleAddToCart = () => {
    if (!dish) return;
    
    const dishWithExtras = {
      ...dish,
      quantity,
      extras: selectedExtras,
      specialInstructions,
      totalPrice: calculateTotal()
    };
    
    onAddToCart(dishWithExtras, quantity);
    
    // Reset form
    setQuantity(1);
    setSelectedExtras([]);
    setSpecialInstructions('');
    onClose();
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

  if (!isOpen || !dish) return null;

  return (
    <div className="dish-detail-modal-overlay" onClick={onClose}>
      <div className="dish-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="dish-detail-modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Image du plat */}
        <div className="dish-detail-modal-image">
          {dish.image ? (
            <img src={dish.image} alt={dish.name} />
          ) : (
            <div className="dish-detail-modal-placeholder">
              <span className="dish-detail-placeholder-icon">🍽️</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="dish-detail-badges">
            {dish.isVegetarian && (
              <span className="badge vegetarian">🌱 Végétarien</span>
            )}
            {dish.spicyLevel > 0 && (
              <span className="badge spicy">
                {getSpicyIcon(dish.spicyLevel)} Épicé
              </span>
            )}
          </div>
        </div>

        {/* Contenu du modal */}
        <div className="dish-detail-modal-content">
          <div className="dish-detail-modal-header">
            <h2 className="dish-detail-modal-title">{dish.name}</h2>
            <span className="dish-detail-modal-price">{dish.price}€</span>
          </div>

          <p className="dish-detail-modal-description">{dish.description}</p>

          {/* Temps de préparation */}
          {dish.preparationTime && (
            <div className="preparation-info">
              <span className="prep-icon">⏱️</span>
              <span>Temps de préparation: {dish.preparationTime}</span>
            </div>
          )}

          {/* Ingrédients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div className="dish-detail-section">
              <h3 className="section-title">Ingrédients</h3>
              <div className="ingredients-list">
                {dish.ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergènes */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="dish-detail-section">
              <h3 className="section-title">⚠️ Allergènes</h3>
              <div className="allergens-list">
                {dish.allergens.map((allergen, index) => (
                  <span key={index} className="allergen-tag">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          <div className="dish-detail-section">
            <h3 className="section-title">Extras (optionnel)</h3>
            <div className="extras-list">
              {availableExtras.map(extra => (
                <label key={extra.id} className="extra-item">
                  <input
                    type="checkbox"
                    checked={selectedExtras.find(item => item.id === extra.id)}
                    onChange={() => handleExtraToggle(extra)}
                  />
                  <span className="extra-name">{extra.name}</span>
                  <span className="extra-price">+{extra.price}€</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instructions spéciales */}
          <div className="dish-detail-section">
            <h3 className="section-title">Instructions spéciales</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ex: Sans oignons, bien cuit, sauce à part..."
              className="special-instructions"
              rows="3"
            />
          </div>

          {/* Quantité et ajout au panier */}
          <div className="dish-detail-modal-footer">
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button className="add-to-cart-detail-modal-btn" onClick={handleAddToCart}>
              Ajouter au panier - {calculateTotal().toFixed(2)}€
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetailModal; 