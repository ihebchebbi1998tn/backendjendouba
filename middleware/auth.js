
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protection des routes - Version JWT
const protect = async (req, res, next) => {
  let token;

  // Récupérer le token depuis l'en-tête
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Récupérer le token depuis la session (pour compatibilité)
  else if (req.session && req.session.userId) {
    req.user = { 
      id: req.session.userId, 
      role: req.session.role 
    };
    return next();
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Compte inactif ou bloqué' });
    }
    
    // Attacher l'utilisateur à la requête
    req.user = {
      id: user.user_id,
      role: user.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour rôle administrateur
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès administrateur requis' });
  }
  next();
};

// Middleware pour rôle fournisseur
const provider = (req, res, next) => {
  if (!req.user || (req.user.role !== 'provider' && req.user.role !== 'admin')) {
    return res.status(403).json({ message: 'Accès fournisseur requis' });
  }
  next();
};

// Vérifier si l'utilisateur est le propriétaire de la ressource ou un administrateur
const isOwnerOrAdmin = (paramId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    
    const resourceId = parseInt(req.params[paramId]);
    if (req.user.role === 'admin' || req.user.id === resourceId) {
      next();
    } else {
      res.status(403).json({ message: 'Non autorisé à accéder à cette ressource' });
    }
  };
};

module.exports = { protect, admin, provider, isOwnerOrAdmin };
