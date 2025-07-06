import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">{t('common.loading')}</div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log('🚫 Accès refusé - Utilisateur non connecté');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis, vérifier que l'utilisateur a le bon rôle
  if (requiredRole && user.role !== requiredRole) {
    console.log(`🚫 Accès refusé - Rôle requis: ${requiredRole}, Rôle actuel: ${user.role}`);
    
    // Rediriger vers le dashboard approprié selon le rôle de l'utilisateur
    if (user.role === 'restaurant') {
      return <Navigate to="/restaurant/dashboard" replace />;
    } else if (user.role === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Si tout est OK, afficher le contenu protégé
  console.log('✅ Accès autorisé au contenu protégé');
  return children;
};

export default ProtectedRoute; 