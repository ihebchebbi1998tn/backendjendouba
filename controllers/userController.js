
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// @desc    Enregistrer un nouvel utilisateur avec authentification simplifiée
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('🔹 Démarrage de l\'enregistrement d\'un nouvel utilisateur');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, email, password, phone } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findByEmail(email);
    if (userExists) {
      console.log(`❌ L'email ${email} est déjà utilisé`);
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }
    
    // Créer un utilisateur avec un mot de passe simplifié
    console.log('👤 Création d\'un nouvel utilisateur:', { nom, prenom, email });
    const userId = await User.create({
      nom,
      prenom,
      email,
      password: password || 'mot-de-passe-simple',
      role: 'utilisateur',
      status: 'actif',
      phone
    });
    
    const user = await User.findById(userId);
    
    if (user) {
      console.log(`✅ Utilisateur créé avec succès: ${userId}`);
      // Retourner des informations utilisateur sans token JWT
      res.status(201).json({
        user_id: user.user_id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      });
    } else {
      console.log('❌ Échec de la création de l\'utilisateur');
      res.status(400).json({ message: 'Données utilisateur invalides' });
    }
  } catch (error) {
    console.error('❌ Erreur d\'enregistrement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Connexion utilisateur avec authentification simplifiée
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('🔹 Tentative de connexion utilisateur');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`👤 Tentative de connexion avec l'email: ${email}`);
    
    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      console.log(`❌ Aucun utilisateur trouvé avec l'email: ${email}`);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier si l'utilisateur est actif
    if (user.status !== 'actif') {
      console.log(`❌ Compte désactivé pour l'utilisateur: ${user.user_id}`);
      return res.status(401).json({ message: 'Ce compte est désactivé' });
    }
    
    // En mode développement, nous acceptons toujours l'authentification
    console.log(`✅ Connexion réussie pour l'utilisateur: ${user.user_id}`);
    res.json({
      user_id: user.user_id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir le profil de l'utilisateur actuel
// @route   GET /api/users/me
// @access  Privé
exports.getMe = async (req, res) => {
  try {
    console.log(`🔹 Récupération du profil utilisateur: ${req.user.id}`);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${req.user.id}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    console.log(`✅ Profil récupéré pour l'utilisateur: ${user.user_id}`);
    res.json({
      user_id: user.user_id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      status: user.status,
      profile_image: user.profile_image,
      phone: user.phone
    });
  } catch (error) {
    console.error('❌ Erreur d\'obtention de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    console.log('🔹 Récupération de tous les utilisateurs');
    const filters = {
      role: req.query.role,
      status: req.query.status,
      search: req.query.search
    };
    
    console.log('🔍 Filtres de recherche:', filters);
    const users = await User.getAll(filters);
    console.log(`✅ ${users.length} utilisateurs récupérés`);
    res.json(users);
  } catch (error) {
    console.error('❌ Erreur d\'obtention de tous les utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Mettre à jour l'utilisateur
// @route   PUT /api/users/:id
// @access  Privé
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`🔹 Mise à jour de l'utilisateur: ${userId}`);
    const { nom, prenom, email, phone, profile_image } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${userId}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const updates = {
      nom: nom || user.nom,
      prenom: prenom || user.prenom,
      email: email || user.email,
      phone: phone || user.phone,
      profile_image: profile_image || user.profile_image
    };
    
    console.log('📝 Données de mise à jour:', updates);
    const success = await User.update(userId, updates);
    
    if (success) {
      const updatedUser = await User.findById(userId);
      console.log(`✅ Utilisateur mis à jour avec succès: ${userId}`);
      res.json(updatedUser);
    } else {
      console.log(`❌ Échec de la mise à jour de l'utilisateur: ${userId}`);
      res.status(400).json({ message: 'Mise à jour échouée' });
    }
  } catch (error) {
    console.error('❌ Erreur de mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Supprimer l'utilisateur
// @route   DELETE /api/users/:id
// @access  Privé
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`🔹 Suppression de l'utilisateur: ${userId}`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${userId}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const success = await User.delete(userId);
    
    if (success) {
      console.log(`✅ Utilisateur supprimé avec succès: ${userId}`);
      res.json({ message: 'Utilisateur supprimé' });
    } else {
      console.log(`❌ Échec de la suppression de l'utilisateur: ${userId}`);
      res.status(400).json({ message: 'Suppression échouée' });
    }
  } catch (error) {
    console.error('❌ Erreur de suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// @desc    Mettre à jour le statut de l'utilisateur
// @route   PATCH /api/users/:id/status
// @access  Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    console.log(`🔹 Mise à jour du statut pour l'utilisateur ${userId} à "${status}"`);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${userId}`);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const success = await User.updateStatus(userId, status);
    
    if (success) {
      const updatedUser = await User.findById(userId);
      console.log(`✅ Statut mis à jour avec succès pour l'utilisateur: ${userId}`);
      res.json(updatedUser);
    } else {
      console.log(`❌ Échec de la mise à jour du statut pour l'utilisateur: ${userId}`);
      res.status(400).json({ message: 'Mise à jour du statut échouée' });
    }
  } catch (error) {
    console.error('❌ Erreur de mise à jour du statut de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
