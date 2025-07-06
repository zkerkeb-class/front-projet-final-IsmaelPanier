const fs = require('fs');
const path = require('path');

// Configuration des remplacements de texte
const textReplacements = {
  // Navigation
  'Accueil': 't(\'navigation.home\')',
  'À propos': 't(\'navigation.about\')',
  'Contact': 't(\'navigation.contact\')',
  'Profil': 't(\'navigation.profile\')',
  'Dashboard': 't(\'navigation.dashboard\')',
  'Favoris': 't(\'user.favorites\')',
  'Déconnexion': 't(\'navigation.logout\')',
  
  // Auth
  'Connexion': 't(\'auth.login\')',
  'Inscription': 't(\'auth.register\')',
  'Se connecter': 't(\'auth.loginButton\')',
  'S\'inscrire': 't(\'auth.registerButton\')',
  'Email': 't(\'auth.email\')',
  'Mot de passe': 't(\'auth.password\')',
  'Confirmer le mot de passe': 't(\'auth.confirmPassword\')',
  'Prénom': 't(\'auth.firstName\')',
  'Nom': 't(\'auth.lastName\')',
  'Téléphone': 't(\'auth.phone\')',
  'Pas encore de compte ?': 't(\'auth.dontHaveAccount\')',
  'Déjà un compte ?': 't(\'auth.alreadyHaveAccount\')',
  
  // Restaurant
  'Restaurants': 't(\'restaurant.restaurants\')',
  'Restaurant': 't(\'restaurant.restaurant\')',
  'Menu': 't(\'restaurant.menu\')',
  'Plats': 't(\'restaurant.dishes\')',
  'Plat': 't(\'restaurant.dish\')',
  'Prix': 't(\'restaurant.price\')',
  'Description': 't(\'restaurant.description\')',
  'Ingrédients': 't(\'restaurant.ingredients\')',
  'Catégorie': 't(\'restaurant.category\')',
  'Cuisine': 't(\'restaurant.cuisine\')',
  'Note': 't(\'restaurant.rating\')',
  'Avis': 't(\'restaurant.reviews\')',
  'Adresse': 't(\'restaurant.address\')',
  'Téléphone': 't(\'restaurant.phone\')',
  'Horaires': 't(\'restaurant.hours\')',
  'Temps de livraison': 't(\'restaurant.deliveryTime\')',
  'Frais de livraison': 't(\'restaurant.deliveryFee\')',
  'Commande minimum': 't(\'restaurant.minimumOrder\')',
  'Ouvert': 't(\'restaurant.open\')',
  'Fermé': 't(\'restaurant.closed\')',
  'Commander maintenant': 't(\'restaurant.orderNow\')',
  'Voir le menu': 't(\'restaurant.viewMenu\')',
  'Ajouter au panier': 't(\'restaurant.addToCart\')',
  'Retirer du panier': 't(\'restaurant.removeFromCart\')',
  'Favori': 't(\'restaurant.favorite\')',
  'Retirer des favoris': 't(\'restaurant.unfavorite\')',
  
  // Cart
  'Panier': 't(\'cart.cart\')',
  'Votre panier est vide': 't(\'cart.cartEmpty\')',
  'articles': 't(\'cart.items\')',
  'article': 't(\'cart.item\')',
  'Sous-total': 't(\'cart.subtotal\')',
  'Taxe': 't(\'cart.tax\')',
  'Total': 't(\'cart.total\')',
  'Commander': 't(\'cart.checkout\')',
  'Vider le panier': 't(\'cart.clearCart\')',
  'Mettre à jour la quantité': 't(\'cart.updateQuantity\')',
  'Retirer l\'article': 't(\'cart.removeItem\')',
  'Quantité': 't(\'cart.quantity\')',
  
  // Order
  'Commande': 't(\'order.order\')',
  'Commandes': 't(\'order.orders\')',
  'Historique des commandes': 't(\'order.orderHistory\')',
  'Suivi de commande': 't(\'order.orderTracking\')',
  'Statut de la commande': 't(\'order.orderStatus\')',
  'Numéro de commande': 't(\'order.orderNumber\')',
  'Date de commande': 't(\'order.orderDate\')',
  'Heure de commande': 't(\'order.orderTime\')',
  'Livraison estimée': 't(\'order.estimatedDelivery\')',
  'Adresse de livraison': 't(\'order.deliveryAddress\')',
  'Méthode de paiement': 't(\'order.paymentMethod\')',
  'Résumé de la commande': 't(\'order.orderSummary\')',
  'Détails de la commande': 't(\'order.orderDetails\')',
  'Confirmation de commande': 't(\'order.orderConfirmation\')',
  'Commande passée': 't(\'order.orderPlaced\')',
  'Commande confirmée': 't(\'order.orderConfirmed\')',
  'Commande en préparation': 't(\'order.orderPreparing\')',
  'Commande prête': 't(\'order.orderReady\')',
  'Commande en livraison': 't(\'order.orderDelivering\')',
  'Commande livrée': 't(\'order.orderDelivered\')',
  'Commande annulée': 't(\'order.orderCancelled\')',
  'Suivre la commande': 't(\'order.trackOrder\')',
  'Commander à nouveau': 't(\'order.reorder\')',
  'Annuler la commande': 't(\'order.cancelOrder\')',
  'Évaluer la commande': 't(\'order.rateOrder\')',
  'Aucune commande trouvée': 't(\'order.noOrders\')',
  
  // User
  'Compte': 't(\'user.account\')',
  'Informations personnelles': 't(\'user.personalInfo\')',
  'Adresses': 't(\'user.addresses\')',
  'Préférences': 't(\'user.preferences\')',
  'Notifications': 't(\'user.notifications\')',
  'Sécurité': 't(\'user.security\')',
  'Changer le mot de passe': 't(\'user.changePassword\')',
  'Mettre à jour le profil': 't(\'user.updateProfile\')',
  'Supprimer le compte': 't(\'user.deleteAccount\')',
  'Paramètres du compte': 't(\'user.accountSettings\')',
  'Adresses de livraison': 't(\'user.deliveryAddresses\')',
  'Ajouter une adresse': 't(\'user.addAddress\')',
  'Modifier l\'adresse': 't(\'user.editAddress\')',
  'Supprimer l\'adresse': 't(\'user.deleteAddress\')',
  'Adresse par défaut': 't(\'user.defaultAddress\')',
  'Aucun favori': 't(\'user.noFavorites\')',
  'Aucune adresse enregistrée': 't(\'user.noAddresses\')',
  
  // Common
  'Bienvenue': 't(\'common.welcome\')',
  'Rechercher': 't(\'common.search\')',
  'Filtrer': 't(\'common.filter\')',
  'Trier': 't(\'common.sort\')',
  'Enregistrer': 't(\'common.save\')',
  'Annuler': 't(\'common.cancel\')',
  'Supprimer': 't(\'common.delete\')',
  'Modifier': 't(\'common.edit\')',
  'Ajouter': 't(\'common.add\')',
  'Voir': 't(\'common.view\')',
  'Retour': 't(\'common.back\')',
  'Suivant': 't(\'common.next\')',
  'Précédent': 't(\'common.previous\')',
  'Soumettre': 't(\'common.submit\')',
  'Chargement...': 't(\'common.loading\')',
  'Erreur': 't(\'common.error\')',
  'Succès': 't(\'common.success\')',
  'Attention': 't(\'common.warning\')',
  'Information': 't(\'common.info\')',
  'Oui': 't(\'common.yes\')',
  'Non': 't(\'common.no\')',
  'Fermer': 't(\'common.close\')',
  'Ouvrir': 't(\'common.open\')',
  'Langue': 't(\'common.language\')',
  'Thème': 't(\'common.theme\')',
  'Sombre': 't(\'common.dark\')',
  'Clair': 't(\'common.light\')',
  'Paramètres': 't(\'common.settings\')',
  'Aide': 't(\'common.help\')',
  'Support': 't(\'common.support\')',
  
  // Errors
  'Une erreur s\'est produite': 't(\'errors.general\')',
  'Erreur de réseau': 't(\'errors.network\')',
  'Erreur du serveur': 't(\'errors.server\')',
  'Page non trouvée': 't(\'errors.notFound\')',
  'Non autorisé': 't(\'errors.unauthorized\')',
  'Accès interdit': 't(\'errors.forbidden\')',
  'Erreur de validation': 't(\'errors.validation\')',
  'Ce champ est requis': 't(\'errors.required\')',
  'Format invalide': 't(\'errors.invalidFormat\')',
  'Longueur minimum non respectée': 't(\'errors.minLength\')',
  'Longueur maximum dépassée': 't(\'errors.maxLength\')',
  'Email invalide': 't(\'errors.emailInvalid\')',
  'Mot de passe trop faible': 't(\'errors.passwordWeak\')',
  
  // Success
  'Profil mis à jour avec succès': 't(\'success.profileUpdated\')',
  'Mot de passe modifié avec succès': 't(\'success.passwordChanged\')',
  'Commande passée avec succès': 't(\'success.orderPlaced\')',
  'Article ajouté avec succès': 't(\'success.itemAdded\')',
  'Article retiré avec succès': 't(\'success.itemRemoved\')',
  'Panier mis à jour avec succès': 't(\'success.cartUpdated\')',
  'Ajouté aux favoris': 't(\'success.favoriteAdded\')',
  'Retiré des favoris': 't(\'success.favoriteRemoved\')',
  'Adresse ajoutée avec succès': 't(\'success.addressAdded\')',
  'Adresse mise à jour avec succès': 't(\'success.addressUpdated\')',
  'Adresse supprimée avec succès': 't(\'success.addressDeleted\')'
};

// Fonction pour ajouter l'import useTranslation
function addUseTranslationImport(content) {
  if (content.includes('useTranslation') || !content.includes('react')) {
    return content;
  }
  
  // Ajouter l'import useTranslation après les autres imports React
  const importRegex = /import\s+.*\s+from\s+['"]react['"];?/;
  const match = content.match(importRegex);
  
  if (match) {
    return content.replace(
      match[0],
      `${match[0]}\nimport { useTranslation } from 'react-i18next';`
    );
  }
  
  return content;
}

// Fonction pour ajouter const { t } = useTranslation();
function addUseTranslationHook(content) {
  if (content.includes('const { t } = useTranslation()')) {
    return content;
  }
  
  // Trouver la fonction principale
  const functionRegex = /const\s+(\w+)\s*=\s*\(\)\s*=>\s*{/;
  const match = content.match(functionRegex);
  
  if (match) {
    const functionName = match[1];
    const hookLine = '  const { t } = useTranslation();\n';
    
    // Insérer après l'ouverture de la fonction
    return content.replace(
      `const ${functionName} = () => {`,
      `const ${functionName} = () => {\n${hookLine}`
    );
  }
  
  return content;
}

// Fonction pour remplacer le texte par les clés de traduction
function replaceTextWithTranslations(content) {
  let updatedContent = content;
  
  for (const [text, translation] of Object.entries(textReplacements)) {
    // Remplacer le texte dans les chaînes de caractères
    const regex = new RegExp(`['"]${text}['"]`, 'g');
    updatedContent = updatedContent.replace(regex, translation);
    
    // Remplacer le texte dans les balises JSX
    const jsxRegex = new RegExp(`>${text}<`, 'g');
    updatedContent = updatedContent.replace(jsxRegex, `>{${translation}}<`);
  }
  
  return updatedContent;
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si c'est un fichier React
    if (!content.includes('import React') && !content.includes('export default')) {
      return;
    }
    
    let updatedContent = content;
    
    // Ajouter l'import useTranslation
    updatedContent = addUseTranslationImport(updatedContent);
    
    // Ajouter le hook useTranslation
    updatedContent = addUseTranslationHook(updatedContent);
    
    // Remplacer le texte par les traductions
    updatedContent = replaceTextWithTranslations(updatedContent);
    
    // Écrire le fichier modifié
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Mis à jour: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules et autres dossiers non pertinents
      if (!['node_modules', '.git', 'build', 'dist'].includes(item)) {
        processDirectory(fullPath);
      }
    } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

// Point d'entrée
const srcPath = path.join(__dirname, '..', 'src');
console.log('🚀 Début de l\'internationalisation...');
processDirectory(srcPath);
console.log('✅ Internationalisation terminée !'); 