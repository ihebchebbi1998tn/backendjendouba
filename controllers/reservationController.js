const Reservation = require("../models/reservationModel");
const Place = require("../models/placeModel");
const Event = require("../models/eventModel");
const { validationResult } = require("express-validator");

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    // For regular users, limit to their own reservations
    if (req.user.role === 'user') {
      req.query.userId = req.user.id;
    } 
    // For providers, limit to reservations for their places/events
    else if (req.user.role === 'provider') {
      // Here you would need logic to determine which places/events belong to the provider
      // This is a simplified example
      const providerPlaces = await Place.getAllByProvider(req.user.id);
      if (providerPlaces.length > 0) {
        const placeIds = providerPlaces.map(place => place.id);
        // Only filter by place if requested place is owned by provider
        if (req.query.placeId && placeIds.includes(parseInt(req.query.placeId))) {
          // Keep the filter as is
        } else {
          // Otherwise, limit to all owned places
          req.query.placeIds = placeIds;
        }
      }
    }

    const reservations = await Reservation.getAll(req.query);
    res.status(200).json({
      status: 200,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.getById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check access permissions
    if (req.user.role === 'user' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // For providers, check if the reservation is for their place/event
    if (req.user.role === 'provider') {
      // Simplification: Add logic to check if the place/event belongs to the provider
      const hasAccess = await checkProviderAccess(req.user.id, reservation);
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json({
      status: 200,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add user ID if not provided (for non-admin users)
    const reservationData = {
      ...req.body,
      userId: req.body.userId || req.user.id
    };

    // Calculate total price based on tickets or persons
    if (reservationData.eventId && reservationData.numberOfTickets) {
      const event = await Event.getById(reservationData.eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      // Check availability
      const isAvailable = await Reservation.checkAvailability(
        'event', 
        reservationData.eventId, 
        null, 
        reservationData.numberOfTickets
      );
      
      if (!isAvailable) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }
      
      // Calculate total price
      reservationData.totalPrice = event.ticketPrice * reservationData.numberOfTickets;
    }
    
    if (reservationData.placeId && reservationData.numberOfPersons) {
      const place = await Place.getById(reservationData.placeId);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }
      
      // Check availability
      if (reservationData.visitDate) {
        const isAvailable = await Reservation.checkAvailability(
          'place', 
          reservationData.placeId, 
          reservationData.visitDate
        );
        
        if (!isAvailable) {
          return res.status(400).json({ message: "Place not available on this date" });
        }
      }
      
      // Calculate total price (simplified - actual calculation depends on your fee structure)
      let entranceFee = 10; // Default value
      if (place.entranceFee) {
        try {
          const fees = JSON.parse(place.entranceFee);
          entranceFee = fees.adult || entranceFee;
        } catch (e) {
          // Use default if parsing fails
        }
      }
      reservationData.totalPrice = entranceFee * reservationData.numberOfPersons;
    }

    const reservationId = await Reservation.create(reservationData);
    const reservation = await Reservation.getById(reservationId);
    
    res.status(201).json({
      status: 201,
      message: "Reservation created successfully",
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check access permissions
    if (req.user.role === 'user' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // For providers, check if the reservation is for their place/event
    if (req.user.role === 'provider') {
      const hasAccess = await checkProviderAccess(req.user.id, reservation);
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Providers can only update certain fields
      const allowedUpdates = ['status', 'paymentStatus'];
      Object.keys(req.body).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete req.body[key];
        }
      });
    }

    // If admin is changing user, entity or quantities, recalculate price
    let updates = { ...req.body };
    if (req.user.role === 'admin' && 
       (updates.eventId !== reservation.eventId || 
        updates.placeId !== reservation.placeId || 
        updates.numberOfTickets !== reservation.numberOfTickets ||
        updates.numberOfPersons !== reservation.numberOfPersons)) {
      
      // Recalculate price - similar logic to createReservation
      // This is simplified and would need to be expanded based on your business logic
      if (updates.eventId && updates.numberOfTickets) {
        const event = await Event.getById(updates.eventId);
        updates.totalPrice = event.ticketPrice * updates.numberOfTickets;
      } else if (updates.placeId && updates.numberOfPersons) {
        // Similar calculation for places
      }
    }

    await Reservation.update(req.params.id, updates);
    
    const updatedReservation = await Reservation.getById(req.params.id);
    res.status(200).json({
      status: 200,
      message: "Reservation updated successfully",
      data: updatedReservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.getById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check access permissions
    if (req.user.role === 'user' && reservation.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // For providers, check if the reservation is for their place/event
    if (req.user.role === 'provider') {
      const hasAccess = await checkProviderAccess(req.user.id, reservation);
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    await Reservation.delete(req.params.id);
    res.status(204).json({
      status: 204,
      message: "Reservation cancelled and deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check availability
exports.checkAvailability = async (req, res) => {
  try {
    const { entityType, entityId, date, numberOfTickets } = req.query;
    
    if (!entityType || !entityId) {
      return res.status(400).json({ message: "Entity type and ID are required" });
    }
    
    const isAvailable = await Reservation.checkAvailability(
      entityType,
      entityId,
      date || null,
      numberOfTickets || 1
    );
    
    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to check if a provider has access to a reservation
async function checkProviderAccess(providerId, reservation) {
  // Check for place
  if (reservation.placeId) {
    const place = await Place.getById(reservation.placeId);
    if (place && place.provider_id === providerId) {
      return true;
    }
  }
  
  // Check for event (assumes events have provider_id field)
  if (reservation.eventId) {
    const event = await Event.getById(reservation.eventId);
    if (event && event.provider_id === providerId) {
      return true;
    }
  }
  
  return false;
}

module.exports = exports;
