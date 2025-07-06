# Internationalisation (i18n) - FoodDelivery+

Ce projet utilise `react-i18next` pour gérer l'internationalisation et supporter plusieurs langues.

## 🚀 Installation

Les dépendances nécessaires sont déjà installées :

```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

## 📁 Structure des fichiers

```
public/
  locales/
    fr/
      translation.json    # Traductions françaises
    en/
      translation.json    # Traductions anglaises
    es/
      translation.json    # Traductions espagnoles

src/
  i18n.js                 # Configuration i18n
  components/
    common/
      LanguageSelector.js # Composant de sélection de langue
      LanguageSelector.css
```

## 🔧 Configuration

### Fichier de configuration (`src/i18n.js`)

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    supportedLngs: ['fr', 'en', 'es'],
    defaultNS: 'translation',
    ns: ['translation'],
  });
```

## 📝 Utilisation dans les composants

### 1. Importer useTranslation

```javascript
import { useTranslation } from 'react-i18next';
```

### 2. Utiliser le hook dans le composant

```javascript
const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('auth.loginTitle')}</p>
    </div>
  );
};
```

### 3. Changer de langue

```javascript
const { i18n } = useTranslation();

// Changer vers l'anglais
i18n.changeLanguage('en');

// Changer vers l'espagnol
i18n.changeLanguage('es');
```

## 🗂️ Organisation des traductions

Les traductions sont organisées par sections :

### Common (Éléments communs)
- `common.welcome` - "Bienvenue"
- `common.loading` - "Chargement..."
- `common.error` - "Erreur"
- `common.success` - "Succès"

### Auth (Authentification)
- `auth.login` - "Connexion"
- `auth.register` - "Inscription"
- `auth.email` - "Email"
- `auth.password` - "Mot de passe"

### Restaurant
- `restaurant.restaurants` - "Restaurants"
- `restaurant.menu` - "Menu"
- `restaurant.dishes` - "Plats"
- `restaurant.price` - "Prix"

### Cart (Panier)
- `cart.cart` - "Panier"
- `cart.cartEmpty` - "Votre panier est vide"
- `cart.total` - "Total"
- `cart.checkout` - "Commander"

### Order (Commandes)
- `order.orders` - "Commandes"
- `order.orderHistory` - "Historique des commandes"
- `order.orderStatus` - "Statut de la commande"

### User (Utilisateur)
- `user.profile` - "Profil"
- `user.favorites` - "Favoris"
- `user.addresses` - "Adresses"

### Navigation
- `navigation.home` - "Accueil"
- `navigation.about` - "À propos"
- `navigation.contact` - "Contact"

### Errors (Erreurs)
- `errors.general` - "Une erreur s'est produite"
- `errors.network` - "Erreur de réseau"
- `errors.validation` - "Erreur de validation"

### Success (Succès)
- `success.profileUpdated` - "Profil mis à jour avec succès"
- `success.orderPlaced` - "Commande passée avec succès"

## 🎨 Composant LanguageSelector

Le composant `LanguageSelector` permet aux utilisateurs de changer de langue facilement :

```javascript
import LanguageSelector from './components/common/LanguageSelector';

// Dans votre composant
<LanguageSelector />
```

### Fonctionnalités :
- Affichage des drapeaux des pays
- Noms des langues
- Sauvegarde automatique de la préférence
- Interface responsive

## 🔄 Mise à jour automatique

Un script automatisé est disponible pour mettre à jour tous les fichiers React :

```bash
node scripts/i18n-update.js
```

Ce script :
1. Ajoute automatiquement l'import `useTranslation`
2. Ajoute le hook `const { t } = useTranslation()`
3. Remplace le texte français par les clés de traduction appropriées

## 🌐 Langues supportées

- **Français (fr)** - Langue par défaut
- **Anglais (en)** - English
- **Espagnol (es)** - Español

## 📱 Détection automatique

La langue est automatiquement détectée selon cet ordre :
1. Préférence sauvegardée dans localStorage
2. Langue du navigateur
3. Langue par défaut (français)

## 🛠️ Ajout d'une nouvelle langue

### 1. Créer le dossier et le fichier de traduction

```bash
mkdir public/locales/de
touch public/locales/de/translation.json
```

### 2. Ajouter les traductions allemandes

```json
{
  "common": {
    "welcome": "Willkommen",
    "loading": "Laden...",
    "error": "Fehler"
  }
}
```

### 3. Mettre à jour la configuration

Dans `src/i18n.js`, ajouter 'de' aux langues supportées :

```javascript
supportedLngs: ['fr', 'en', 'es', 'de'],
```

### 4. Mettre à jour le LanguageSelector

Ajouter l'allemand dans le composant `LanguageSelector.js` :

```javascript
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }, // Nouvelle langue
];
```

## 🎯 Bonnes pratiques

1. **Utilisez des clés descriptives** : `restaurant.deliveryTime` plutôt que `delivery`
2. **Groupez les traductions** : Organisez par fonctionnalité (auth, restaurant, cart, etc.)
3. **Utilisez des variables** : `t('welcome', { name: userName })`
4. **Testez toutes les langues** : Vérifiez que les traductions s'affichent correctement
5. **Maintenez la cohérence** : Utilisez les mêmes termes dans toute l'application

## 🔍 Débogage

En mode développement, les clés manquantes sont affichées dans la console.

Pour activer le mode debug :

```javascript
debug: true
```

## 📚 Ressources

- [Documentation react-i18next](https://react.i18next.com/)
- [Documentation i18next](https://www.i18next.com/)
- [Guide des bonnes pratiques](https://www.i18next.com/overview/best-practices) 