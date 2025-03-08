
const Place = require("../models/placeModel");
const { validationResult } = require("express-validator");

exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.getAll();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchPlaces = async (req, res) => {
  try {
    const places = await Place.search(req.query);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.getById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // If provider is creating, set provider_id
    const placeData = { ...req.body };
    if (req.user.role === 'provider') {
      placeData.provider_id = req.user.id;
    } else if (req.user.role === 'admin' && req.body.provider_id) {
      // Admin can specify provider_id
      placeData.provider_id = req.body.provider_id;
    }

    const placeId = await Place.create(placeData);
    
    const place = await Place.getById(placeId);
    res.status(201).json({
      message: "Place created successfully",
      place
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if place exists
    const place = await Place.getById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check if user has permission to update
    if (req.user.role === 'provider' && place.provider_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this place" });
    }

    // Providers can't change provider_id
    if (req.user.role === 'provider') {
      delete req.body.provider_id;
    }

    await Place.update(req.params.id, req.body);
    
    const updatedPlace = await Place.getById(req.params.id);
    res.json({
      message: "Place updated successfully",
      place: updatedPlace
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    // Check if place exists
    const place = await Place.getById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check if user has permission to delete
    if (req.user.role === 'provider' && place.provider_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this place" });
    }

    await Place.delete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get places by provider
exports.getPlacesByProvider = async (req, res) => {
  try {
    // If provider is requesting their own places
    const providerId = req.user.role === 'provider' ? req.user.id : req.params.providerId;
    
    // If not admin and not requesting own places
    if (req.user.role !== 'admin' && req.user.id !== parseInt(providerId)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const places = await Place.getByProviderId(providerId);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
