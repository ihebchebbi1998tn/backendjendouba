
const Review = require("../models/reviewModel");
const Place = require("../models/placeModel");
const { validationResult } = require("express-validator");

// Récupérer tous les avis
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAll(req.query);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un avis par son ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un avis
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Ajouter l'identifiant de l'utilisateur à partir de l'authentification
    const reviewData = {
      ...req.body,
      user_id: req.user.id
    };

    // Vérifier si le lieu existe
    const place = await Place.getById(reviewData.place_id);
    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    // Si l'utilisateur est un administrateur, approuver automatiquement l'avis
    if (req.user.role === 'admin') {
      reviewData.status = 'approved';
    }

    const reviewId = await Review.create(reviewData);
    
    const review = await Review.getById(reviewId);
    res.status(201).json({
      message: "Avis soumis avec succès",
      review
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un avis
exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Vérifier si l'avis existe
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    // Autoriser la mise à jour uniquement si l'utilisateur est l'auteur ou un administrateur
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à mettre à jour cet avis" });
    }

    // Si un utilisateur normal met à jour son propre avis, remettre le statut en attente
    if (req.user.role !== 'admin' && review.user_id === req.user.id) {
      req.body.status = 'pending';
    }

    await Review.update(req.params.id, req.body);
    
    const updatedReview = await Review.getById(req.params.id);
    res.json({
      message: "Avis mis à jour avec succès",
      review: updatedReview
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un avis
exports.deleteReview = async (req, res) => {
  try {
    // Vérifier si l'avis existe
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    // Autoriser la suppression uniquement si l'utilisateur est l'auteur ou un administrateur
    if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à supprimer cet avis" });
    }

    await Review.delete(req.params.id);
    res.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le statut d'un avis (administrateur uniquement)
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Vérifier si l'avis existe
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    await Review.update(req.params.id, { status });
    res.json({ message: "Statut de l'avis mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
