
const Review = require("../models/reviewModel");
const Place = require("../models/placeModel");
const { validationResult } = require("express-validator");

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAll(req.query);
    res.status(200).json({
      status: 200,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};

// Get a review by its ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ 
        status: 404,
        message: "Review not found" 
      });
    }
    res.status(200).json({
      status: 200,
      data: review
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 400,
      errors: errors.array() 
    });
  }

  try {
    // Add the user ID from authentication if not provided
    if (!req.body.userId && req.user) {
      req.body.userId = req.user.id;
    }

    // Check if the place exists
    const place = await Place.getById(req.body.placeId);
    if (!place) {
      return res.status(404).json({ 
        status: 404,
        message: "Place not found" 
      });
    }

    const reviewId = await Review.create(req.body);
    const review = await Review.getById(reviewId);
    
    res.status(201).json({
      status: 201,
      message: "Review successfully submitted",
      data: review
    });
  } catch (error) {
    res.status(400).json({ 
      status: 400,
      message: error.message 
    });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 400,
      errors: errors.array() 
    });
  }

  try {
    // Check if the review exists
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ 
        status: 404,
        message: "Review not found" 
      });
    }

    // Authorize update only if user is the author or an admin
    if (req.user && req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({ 
        status: 403,
        message: "Not authorized to update this review" 
      });
    }

    await Review.update(req.params.id, req.body);
    
    const updatedReview = await Review.getById(req.params.id);
    res.status(200).json({
      status: 200,
      message: "Review successfully updated",
      data: updatedReview
    });
  } catch (error) {
    res.status(400).json({ 
      status: 400,
      message: error.message 
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    // Check if the review exists
    const review = await Review.getById(req.params.id);
    if (!review) {
      return res.status(404).json({ 
        status: 404,
        message: "Review not found" 
      });
    }

    // Authorize deletion only if user is the author or an admin
    if (req.user && req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({ 
        status: 403,
        message: "Not authorized to delete this review" 
      });
    }

    await Review.delete(req.params.id);
    res.status(204).json({ 
      status: 204,
      message: "Review deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 500,
      message: error.message 
    });
  }
};
