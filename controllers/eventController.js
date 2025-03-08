
const Event = require("../models/eventModel");
const Place = require("../models/placeModel");
const { validationResult } = require("express-validator");

// Récupérer tous les événements
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll(req.query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un événement par son ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un événement
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Ajouter l'identifiant de l'utilisateur qui crée l'événement
    const eventData = {
      ...req.body,
      created_by: req.user.id
    };

    // Vérifier si le lieu existe
    if (eventData.place_id) {
      const place = await Place.getById(eventData.place_id);
      if (!place) {
        return res.status(404).json({ message: "Lieu non trouvé" });
      }
      
      // Si l'utilisateur est un fournisseur, vérifier s'il est propriétaire du lieu
      if (req.user.role === 'provider' && place.provider_id !== req.user.id) {
        return res.status(403).json({ message: "Non autorisé à créer des événements pour ce lieu" });
      }
    }

    const eventId = await Event.create(eventData);
    
    const event = await Event.getById(eventId);
    res.status(201).json({
      message: "Événement créé avec succès",
      event
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un événement
exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Vérifier si l'événement existe
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Vérifier si l'utilisateur a la permission de mettre à jour
    if (req.user.role === 'provider') {
      if (event.created_by !== req.user.id) {
        return res.status(403).json({ message: "Non autorisé à mettre à jour cet événement" });
      }
      
      // Si changement de lieu, vérifier si le fournisseur est propriétaire du nouveau lieu
      if (req.body.place_id && req.body.place_id !== event.place_id) {
        const place = await Place.getById(req.body.place_id);
        if (!place || place.provider_id !== req.user.id) {
          return res.status(403).json({ message: "Non autorisé à utiliser ce lieu" });
        }
      }
    }

    await Event.update(req.params.id, req.body);
    
    const updatedEvent = await Event.getById(req.params.id);
    res.json({
      message: "Événement mis à jour avec succès",
      event: updatedEvent
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  try {
    // Vérifier si l'événement existe
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Vérifier si l'utilisateur a la permission de supprimer
    if (req.user.role === 'provider' && event.created_by !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à supprimer cet événement" });
    }

    await Event.delete(req.params.id);
    res.json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les événements à venir
exports.getUpcomingEvents = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const events = await Event.getUpcomingEvents(limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
