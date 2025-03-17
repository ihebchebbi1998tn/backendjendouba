
const Event = require("../models/eventModel");
const { validationResult } = require("express-validator");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll(req.query);
    res.status(200).json({
      status: 200,
      data: events
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        status: 404,
        message: "Event not found" 
      });
    }
    res.status(200).json({
      status: 200,
      data: event
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 400,
      errors: errors.array() 
    });
  }

  try {
    const eventId = await Event.create(req.body);
    const event = await Event.getById(eventId);
    
    res.status(201).json({
      status: 201,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    res.status(400).json({ 
      status: 400,
      message: error.message 
    });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 400,
      errors: errors.array() 
    });
  }

  try {
    // Check if the event exists
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        status: 404,
        message: "Event not found" 
      });
    }

    await Event.update(req.params.id, req.body);
    
    const updatedEvent = await Event.getById(req.params.id);
    res.status(200).json({
      status: 200,
      message: "Event updated successfully",
      data: updatedEvent
    });
  } catch (error) {
    res.status(400).json({ 
      status: 400,
      message: error.message 
    });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    // Check if the event exists
    const event = await Event.getById(req.params.id);
    if (!event) {
      return res.status(404).json({ 
        status: 404,
        message: "Event not found" 
      });
    }

    await Event.delete(req.params.id);
    res.status(204).json({ 
      status: 204,
      message: "Event deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const events = await Event.getUpcomingEvents(limit);
    res.status(200).json({
      status: 200,
      data: events
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};
