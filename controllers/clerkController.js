
/**
 * Clerk Controller
 * 
 * Handles integration with Clerk authentication service.
 * Responsible for synchronizing Clerk users with the application's user database
 * and handling sign-out events.
 */
const User = require('../models/userModel');

/**
 * @desc    Synchronize Clerk user with our database
 * @route   POST /api/clerk/sync
 * @access  Public
 */
exports.syncClerkUser = async (req, res) => {
  try {
    console.log('🔹 Synchronisation d\'un utilisateur Clerk');
    const { email, nom, prenom, phone, profileImage, oauth_id, oauth_provider } = req.body;
    console.log('👤 Données utilisateur reçues:', { email, nom, prenom, oauth_provider });
    
    // Check if user already exists
    const userExists = await User.findByEmail(email);
    
    if (userExists) {
      console.log(`✅ Utilisateur existant trouvé: ${userExists.user_id}`);
      // Return existing user
      return res.status(200).json({
        user_id: userExists.user_id,
        nom: userExists.nom,
        prenom: userExists.prenom,
        email: userExists.email,
        role: userExists.role
      });
    }
    
    // User doesn't exist, create a new one
    console.log('👤 Création d\'un nouvel utilisateur depuis Clerk');
    const userId = await User.create({
      nom: nom || '-',
      prenom: prenom || '-',
      email,
      password: 'mot-de-passe-simple', // Simplified for development
      role: 'utilisateur',
      status: 'actif',
      phone: phone || '-',
      profile_image: profileImage || null,
      oauth_id,
      oauth_provider
    });
    
    const user = await User.findById(userId);
    
    if (user) {
      console.log(`✅ Utilisateur Clerk créé avec succès: ${userId}`);
      res.status(201).json({
        user_id: user.user_id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      });
    } else {
      console.log('❌ Échec de la création de l\'utilisateur Clerk');
      res.status(400).json({ message: 'Données utilisateur invalides' });
    }
  } catch (error) {
    console.error('❌ Erreur de synchronisation Clerk:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * @desc    Handle Clerk sign out event
 * @route   POST /api/clerk/signout
 * @access  Public
 */
exports.handleClerkSignout = async (req, res) => {
  try {
    console.log('🔹 Déconnexion d\'un utilisateur Clerk');
    // Simplified sign-out process for development
    console.log('✅ Déconnexion Clerk réussie');
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('❌ Erreur de déconnexion Clerk:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
