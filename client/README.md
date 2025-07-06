# 🍕 FoodDelivery+ - Frontend

Une application moderne de livraison de nourriture développée avec React, offrant une expérience utilisateur exceptionnelle avec des fonctionnalités avancées.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm start

# Construire pour la production
npm run build
```

## 📱 Démo

L'application est accessible sur : `http://localhost:3000`

---

## 💡 Côté Front - Fonctionnalités Implémentées

### ✅ **Routeur (react-router-dom)**
- Navigation complète avec `react-router-dom v6`
- Routes protégées pour les utilisateurs authentifiés
- Gestion des redirections automatiques
- Navigation programmatique

### ✅ **Site Responsive (Mobile First)**
- Design Mobile First avec breakpoints CSS personnalisés
- Interface adaptative pour tous les écrans (mobile, tablette, desktop)
- Navigation mobile avec menu hamburger
- Composants optimisés pour le tactile

### ✅ **Système d'Authentification + Routes Protégées**
- Inscription/Connexion avec validation
- Gestion des rôles (Client/Restaurant)
- Routes protégées avec `ProtectedRoute`
- Gestion des tokens JWT
- Déconnexion automatique

### ✅ **CSS Classique (Sans Librairies)**
- CSS vanilla personnalisé (pas de Bootstrap/Tailwind)
- Variables CSS pour la cohérence
- Système de grille personnalisé
- Animations CSS pures

### ✅ **Code Propre et Structuré**
```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs
│   └── ...
├── pages/              # Pages de l'application
│   ├── auth/          # Pages d'authentification
│   ├── user/          # Pages utilisateur
│   ├── restaurant/    # Pages restaurant
│   └── common/        # Pages communes
├── context/           # Contextes React
├── hooks/             # Hooks personnalisés
├── styles/            # Styles globaux
└── utils/             # Utilitaires
```

### ✅ **Normes ES6+ Modernes**
- Arrow functions
- Destructuring
- Template literals
- Async/await
- Modules ES6
- Hooks React (useState, useEffect, useContext)

### ✅ **Système de Retour Utilisateur**
- Notifications de succès/erreur
- Loaders pendant les appels API
- Gestion des erreurs réseau
- Messages d'état pour l'utilisateur
- Feedback visuel pour toutes les actions

### ✅ **Context (State Global)**
- `AuthContext` : Gestion de l'authentification
- `ThemeContext` : Gestion du thème sombre/clair
- État global partagé entre composants
- Gestion des préférences utilisateur

### ✅ **Hooks Personnalisés**
- `useAuth` : Gestion de l'authentification
- `useTheme` : Gestion du thème
- `useI18n` : Gestion de l'internationalisation
- `useLocalStorage` : Persistance des données
- `useApi` : Gestion des appels API

### ✅ **Thème Sombre/Clair**
- Basculement automatique du thème
- Sauvegarde des préférences
- Variables CSS pour les couleurs
- Transitions fluides entre thèmes

### ✅ **Système de Thème Global**
- Variables CSS centralisées
- Palette de couleurs cohérente
- Pas de couleurs hardcodées
- Système de design unifié

### ✅ **Animations**
- Transitions CSS fluides
- Animations d'entrée/sortie
- Effets hover interactifs
- Animations de chargement
- Transitions de page

### ✅ **Système Multilingue (i18n)**
- Support de 3 langues : Français, Anglais, Espagnol
- Sélecteur de langue avec drapeaux
- Détection automatique de la langue
- 223 clés de traduction organisées
- Sauvegarde des préférences

---

## 🌟 **BONUS - Fonctionnalités Avancées**

### 🎨 **Interface Utilisateur Avancée**
- Design moderne et élégant
- Composants modaux interactifs
- Système de cartes avec hover effects
- Navigation intuitive avec breadcrumbs
- Interface adaptative pour tous les appareils

### 🔐 **Sécurité Renforcée**
- Validation côté client
- Protection CSRF
- Gestion sécurisée des tokens
- Routes protégées par rôle
- Validation des données

### 📊 **Gestion d'État Avancée**
- État local optimisé
- Cache intelligent
- Synchronisation des données
- Gestion des conflits
- Persistance des données

### 🎯 **Expérience Utilisateur**
- Interface intuitive
- Feedback visuel immédiat
- Navigation fluide
- Chargement progressif
- Gestion des erreurs gracieuse

### 🔧 **Outils de Développement**
- Scripts d'automatisation
- Documentation complète
- Types TypeScript
- Hooks personnalisés réutilisables
- Utilitaires de développement

### 📱 **Fonctionnalités Mobile**
- PWA ready
- Interface tactile optimisée
- Gestes de navigation
- Performance mobile optimisée
- Offline capabilities

### 🎨 **Design System**
- Composants réutilisables
- Système de couleurs cohérent
- Typographie unifiée
- Espacement standardisé
- Composants accessibles

### 🔄 **Performance**
- Lazy loading des composants
- Optimisation des images
- Cache intelligent
- Code splitting
- Bundle optimization

---

## 🛠️ Technologies Utilisées

- **React 18** - Bibliothèque UI
- **React Router DOM** - Navigation
- **Context API** - Gestion d'état global
- **CSS3** - Styles personnalisés
- **ES6+** - JavaScript moderne
- **i18next** - Internationalisation
- **JWT** - Authentification
- **LocalStorage** - Persistance

---

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/
│   │   ├── Header.js              # Header avec navigation
│   │   ├── Footer.js              # Footer
│   │   ├── LanguageSelector.js    # Sélecteur de langue
│   │   ├── ThemeToggle.js         # Basculement de thème
│   │   ├── Notification.js        # Système de notifications
│   │   ├── ProtectedRoute.js      # Routes protégées
│   │   └── ...
│   └── ...
├── pages/
│   ├── auth/
│   │   ├── Login.js               # Page de connexion
│   │   ├── Register.js            # Page d'inscription
│   │   └── RestaurantRegister.js  # Inscription restaurant
│   ├── user/
│   │   ├── Dashboard.js           # Dashboard utilisateur
│   │   ├── Cart.js                # Panier
│   │   ├── Favorites.js           # Favoris
│   │   ├── OrderHistory.js        # Historique commandes
│   │   ├── Profile.js             # Profil utilisateur
│   │   ├── RestaurantList.js      # Liste restaurants
│   │   ├── RestaurantDetails.js   # Détails restaurant
│   │   └── RestaurantMenu.js      # Menu restaurant
│   ├── restaurant/
│   │   ├── Dashboard.js           # Dashboard restaurant
│   │   ├── DishManagement.js      # Gestion plats
│   │   ├── OrderManagement.js     # Gestion commandes
│   │   └── Profile.js             # Profil restaurant
│   └── common/
│       ├── Home.js                # Page d'accueil
│       ├── About.js               # À propos
│       ├── Contact.js             # Contact
│       └── NavigationGuide.js     # Guide navigation
├── context/
│   ├── AuthContext.js             # Contexte authentification
│   └── ThemeContext.js            # Contexte thème
├── hooks/
│   └── useI18n.js                 # Hook internationalisation
├── styles/
│   ├── theme.css                  # Variables CSS
│   └── ...
├── i18n.js                        # Configuration i18n
└── App.js                         # Composant principal
```

---

## 🎨 Système de Design

### Couleurs
```css
:root {
  /* Couleurs primaires */
  --primary-color: #ff6b35;
  --primary-hover: #e55a2b;
  
  /* Couleurs secondaires */
  --secondary-color: #2c3e50;
  --accent-color: #3498db;
  
  /* Couleurs de fond */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-dark: #1a1a1a;
  
  /* Couleurs de texte */
  --text-primary: #2c3e50;
  --text-secondary: #6c757d;
  --text-light: #ffffff;
}
```

### Typographie
- **Police principale** : System fonts
- **Tailles** : 12px, 14px, 16px, 18px, 24px, 32px, 48px
- **Poids** : 400 (normal), 500 (medium), 600 (semi-bold), 700 (bold)

### Espacement
- **Base** : 8px
- **Échelles** : 8px, 16px, 24px, 32px, 48px, 64px

---

## 🌐 Internationalisation

### Langues Supportées
- 🇫🇷 **Français** (langue par défaut)
- 🇺🇸 **Anglais**
- 🇪🇸 **Espagnol**

### Utilisation
```javascript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('common.welcome')}</h1>;
```

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm start              # Démarrer le serveur de développement
npm run build          # Construire pour la production
npm test               # Lancer les tests
npm run eject          # Éjecter Create React App

# Internationalisation
node scripts/i18n-update.js  # Mettre à jour les traductions
```

---

## 📚 Documentation

- [Guide d'internationalisation](README_I18N.md)
- [Résumé des fonctionnalités](INTERNATIONALISATION_SUMMARY.md)
- [Types TypeScript](src/types/i18n.d.ts)

---

## 🎯 Fonctionnalités Clés

### 👤 **Gestion des Utilisateurs**
- Inscription/Connexion sécurisée
- Profils personnalisables
- Gestion des favoris
- Historique des commandes

### 🏪 **Gestion des Restaurants**
- Dashboard restaurant
- Gestion des plats
- Suivi des commandes
- Statistiques de vente

### 🛒 **Système de Panier**
- Ajout/suppression de plats
- Calcul automatique des prix
- Sauvegarde du panier
- Validation des commandes

### 📦 **Gestion des Commandes**
- Suivi en temps réel
- Statuts multiples
- Notifications automatiques
- Historique complet

---

## 🚀 Déploiement

L'application est prête pour le déploiement en production avec :
- Optimisation des performances
- Code splitting
- Compression des assets
- Service Worker (PWA)

---

## 👨‍💻 Développé par

**Ismael Panier** - Développeur Full Stack

---

## 📄 Licence

Ce projet est sous licence MIT.

---

**🎉 FoodDelivery+ - Une expérience de livraison de nourriture moderne et intuitive !**
