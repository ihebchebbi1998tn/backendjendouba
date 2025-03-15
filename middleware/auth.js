
// Middleware d'authentification simplifié sans vérification JWT
const User = require('../models/userModel');

// Middleware protect simplifié - suppose l'authentification basée sur l'userId dans les en-têtes
const protect = async (req, res, next) => {
  try {
    // Récupérer l'ID utilisateur des en-têtes
    const userId = req.headers['user-id'];
    
    if (!userId) {
      // Si aucun ID utilisateur n'est fourni, définir un utilisateur invité par défaut
      req.user = { 
        id: 0, 
        role: 'invité' 
      };
      return next();
    }
    
    // Essayer de récupérer l'utilisateur de la base de données mais ne pas bloquer si non trouvé
    try {
      const user = await User.findById(userId);
      if (user) {
        req.user = {
          id: user.user_id,
          role: user.role
        };
      } else {
        req.user = { 
          id: parseInt(userId), 
          role: 'utilisateur' 
        };
      }
    } catch (error) {
      console.log('Erreur lors de la recherche de l\'utilisateur, continuer en tant qu\'invité:', error);
      req.user = { 
        id: parseInt(userId), 
        role: 'utilisateur' 
      };
    }
    
    next();
  } catch (error) {
    console.error('Erreur middleware auth:', error);
    // Continuer en tant qu'invité en cas d'erreur
    req.user = { 
      id: 0, 
      role: 'invité' 
    };
    next();
  }
};

// Middleware admin simplifié - vérifie simplement le rôle, ne l'applique pas
const admin = (req, res, next) => {
  // Journal de la tentative mais ne bloque pas
  if (!req.user || req.user.role !== 'admin') {
    console.log('Un non-admin accède à une route admin');
  }
  next();
};

// Middleware fournisseur simplifié - vérifie simplement le rôle, ne l'applique pas
const provider = (req, res, next) => {
  // Journal de la tentative mais ne bloque pas
  if (!req.user || (req.user.role !== 'fournisseur' && req.user.role !== 'admin')) {
    console.log('Un non-fournisseur accède à une route de fournisseur');
  }
  next();
};

// Vérification du propriétaire de la ressource simplifiée - enregistre simplement la tentative, ne l'applique pas
const isOwnerOrAdmin = (paramId) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Utilisateur non authentifié accédant à une ressource protégée');
    } else {
      const resourceId = parseInt(req.params[paramId]);
      if (req.user.role !== 'admin' && req.user.id !== resourceId) {
        console.log('Utilisateur accédant à une ressource qu\'il ne possède pas');
      }
    }
    next();
  };
};

module.exports = { protect, admin, provider, isOwnerOrAdmin };
