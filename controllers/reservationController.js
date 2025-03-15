
const Reservation = require("../models/reservationModel");
const Place = require("../models/placeModel");
const Event = require("../models/eventModel");
const { validationResult } = require("express-validator");

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    // Pour les utilisateurs normaux, limiter à leurs propres réservations
    if (req.user.role === 'user') {
      req.query.user_id = req.user.id;
    } 
    // Pour les fournisseurs, limiter aux réservations de leurs lieux
    else if (req.user.role === 'provider' && req.query.place_id) {
      const place = await Place.getById(req.query.place_id);
      if (!place || place.provider_id !== req.user.id) {
        return res.status(403).json({ message: "Accès refusé aux réservations de ce lieu" });
      }
    }

    const reservations = await Reservation.getAll(req.query);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une réservation par son ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier les droits d'accès
    if (req.user.role === 'user' && reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à accéder à cette réservation" });
    }

    if (req.user.role === 'provider') {
      const place = await Place.getById(reservation.place_id);
      if (!place || place.provider_id !== req.user.id) {
        return res.status(403).json({ message: "Non autorisé à accéder à cette réservation" });
      }
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer une réservation
exports.createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Ajouter l'identifiant de l'utilisateur (si non spécifié pour un admin qui crée au nom d'un autre)
    const reservationData = {
      ...req.body,
      user_id: req.body.user_id || req.user.id
    };

    // Vérifier si le lieu existe
    const place = await Place.getById(reservationData.place_id);
    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    // Vérifier si l'événement existe (si fourni)
    if (reservationData.event_id) {
      const event = await Event.getById(reservationData.event_id);
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }
    }

    // Vérifier la disponibilité
    const isAvailable = await Reservation.checkAvailability(
      reservationData.place_id,
      reservationData.reservation_date,
      reservationData.start_time,
      reservationData.end_time
    );

    if (!isAvailable) {
      return res.status(400).json({ message: "Le créneau horaire sélectionné n'est pas disponible" });
    }

    const reservationId = await Reservation.create(reservationData);
    
    const reservation = await Reservation.getById(reservationId);
    res.status(201).json({
      message: "Réservation créée avec succès",
      reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Vérifier si la réservation existe
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier les droits d'accès
    if (req.user.role === 'user' && reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à mettre à jour cette réservation" });
    }

    if (req.user.role === 'provider') {
      const place = await Place.getById(reservation.place_id);
      if (!place || place.provider_id !== req.user.id) {
        return res.status(403).json({ message: "Non autorisé à mettre à jour cette réservation" });
      }
      
      // Les fournisseurs peuvent uniquement mettre à jour le statut
      const allowedUpdates = ['status', 'notes'];
      Object.keys(req.body).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete req.body[key];
        }
      });
    }

    // Si changement de date/heure, vérifier la disponibilité
    if (req.body.reservation_date || req.body.start_time || req.body.end_time) {
      const isAvailable = await Reservation.checkAvailability(
        reservation.place_id,
        req.body.reservation_date || reservation.reservation_date,
        req.body.start_time || reservation.start_time,
        req.body.end_time || reservation.end_time
      );

      if (!isAvailable) {
        return res.status(400).json({ message: "Le créneau horaire sélectionné n'est pas disponible" });
      }
    }

    await Reservation.update(req.params.id, req.body);
    
    const updatedReservation = await Reservation.getById(req.params.id);
    res.json({
      message: "Réservation mise à jour avec succès",
      reservation: updatedReservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    // Vérifier si la réservation existe
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier les droits d'accès
    if (req.user.role === 'user' && reservation.user_id !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à supprimer cette réservation" });
    }

    if (req.user.role === 'provider') {
      const place = await Place.getById(reservation.place_id);
      if (!place || place.provider_id !== req.user.id) {
        return res.status(403).json({ message: "Non autorisé à supprimer cette réservation" });
      }
    }

    await Reservation.delete(req.params.id);
    res.json({ message: "Réservation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vérifier la disponibilité
exports.checkAvailability = async (req, res) => {
  try {
    const { place_id, date, start_time, end_time } = req.query;
    
    if (!place_id || !date || !start_time) {
      return res.status(400).json({ message: "Paramètres requis manquants" });
    }
    
    const isAvailable = await Reservation.checkAvailability(
      place_id,
      date,
      start_time,
      end_time || null
    );
    
    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
