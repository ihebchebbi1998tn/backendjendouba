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
    const placeId = await Place.create(req.body);
    res.status(201).json({
      id: placeId,
      ...req.body,
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
    await Place.update(req.params.id, req.body);
    res.json({ message: "Place updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    await Place.delete(req.params.id);
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
