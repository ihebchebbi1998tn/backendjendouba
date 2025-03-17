const Place = require("../models/placeModel");
const { validationResult } = require("express-validator");

exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.getAll();
    
    // Parse JSON strings into objects
    const formattedPlaces = places.map(place => ({
      id: place.id,
      name: place.name,
      type: place.type,
      location: JSON.parse(place.location || '{}'),
      description: place.description
    }));
    
    res.status(200).json({
      status: 200,
      data: formattedPlaces
    });
  } catch (error) {
    console.error("Error in getAllPlaces:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.searchPlaces = async (req, res) => {
  try {
    const places = await Place.search(req.query);
    
    // Add distance calculation if near parameter was provided
    if (req.query.near) {
      // Already calculated in the SQL query using haversine formula
      res.json(places);
    } else {
      res.json(places);
    }
  } catch (error) {
    console.error("Error in searchPlaces:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.getById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    
    // Parse JSON strings into objects
    const formattedPlace = {
      ...place,
      location: JSON.parse(place.location || '{}'),
      images: JSON.parse(place.images || '[]'),
      openingHours: JSON.parse(place.openingHours || '{}'),
      entranceFee: JSON.parse(place.entranceFee || '{}')
    };
    
    res.status(200).json({
      status: 200,
      data: formattedPlace
    });
  } catch (error) {
    console.error("Error in getPlaceById:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPlacesByRegion = async (req, res) => {
  try {
    const region = req.params.region;
    const places = await Place.getByRegion(region);
    res.json(places);
  } catch (error) {
    console.error("Error in getPlacesByRegion:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPopularPlaces = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const places = await Place.getPopular(limit);
    res.json(places);
  } catch (error) {
    console.error("Error in getPopularPlaces:", error);
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
    
    // Parse JSON strings into objects
    const formattedPlace = {
      ...place,
      location: JSON.parse(place.location || '{}'),
      images: JSON.parse(place.images || '[]'),
      openingHours: JSON.parse(place.openingHours || '{}'),
      entranceFee: JSON.parse(place.entranceFee || '{}')
    };
    
    res.status(201).json({
      status: 201,
      message: "Place created successfully",
      data: formattedPlace
    });
  } catch (error) {
    console.error("Error in createPlace:", error);
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
    
    // Parse JSON strings into objects
    const formattedPlace = {
      ...updatedPlace,
      location: JSON.parse(updatedPlace.location || '{}'),
      images: JSON.parse(updatedPlace.images || '[]'),
      openingHours: JSON.parse(updatedPlace.openingHours || '{}'),
      entranceFee: JSON.parse(updatedPlace.entranceFee || '{}')
    };
    
    res.status(200).json({
      status: 200,
      message: "Place updated successfully",
      data: formattedPlace
    });
  } catch (error) {
    console.error("Error in updatePlace:", error);
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
    res.status(204).json({ 
      status: 204,
      message: "Place deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deletePlace:", error);
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
    console.error("Error in getPlacesByProvider:", error);
    res.status(500).json({ message: error.message });
  }
};
