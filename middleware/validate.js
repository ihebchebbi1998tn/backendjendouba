
const { body, validationResult, param, query } = require("express-validator");

exports.registerValidation = [
  body("nom").notEmpty().withMessage("Nom is required"),
  body("prenom").notEmpty().withMessage("Prenom is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.placeValidation = [
  body("name")
    .notEmpty()
    .withMessage("Place name is required")
    .isLength({ max: 255 })
    .withMessage("Name too long"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isLength({ max: 50 })
    .withMessage("Type too long"),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description too long"),
  body("location")
    .optional()
    .isObject()
    .withMessage("Location must be an object"),
  body("location.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("location.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),
  body("openingHours")
    .optional()
    .isObject()
    .withMessage("Opening hours must be an object"),
  body("entranceFee")
    .optional()
    .isObject()
    .withMessage("Entrance fee must be an object"),
];

exports.idValidation = [param("id").isInt().withMessage("Invalid ID format")];

exports.reviewValidation = [
  body("placeId").isInt().withMessage("Place ID is required"),
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("comment")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Comment too long"),
];

exports.reservationValidation = [
  body("userId").optional().isInt().withMessage("Valid user ID is required"),
  body("eventId")
    .optional()
    .isInt()
    .withMessage("Valid event ID is required")
    .custom((value, { req }) => {
      if (!value && !req.body.placeId) {
        throw new Error("Either eventId or placeId is required");
      }
      return true;
    }),
  body("placeId")
    .optional()
    .isInt()
    .withMessage("Valid place ID is required"),
  body("numberOfTickets")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Number of tickets must be at least 1")
    .custom((value, { req }) => {
      if (req.body.eventId && !value) {
        throw new Error("Number of tickets is required for event reservations");
      }
      return true;
    }),
  body("numberOfPersons")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Number of persons must be at least 1")
    .custom((value, { req }) => {
      if (req.body.placeId && !value) {
        throw new Error("Number of persons is required for place reservations");
      }
      return true;
    }),
  body("visitDate")
    .optional()
    .isISO8601()
    .withMessage("Valid visit date is required")
    .custom((value, { req }) => {
      if (req.body.placeId && !value) {
        throw new Error("Visit date is required for place reservations");
      }
      return true;
    }),
  body("paymentMethod")
    .optional()
    .isString()
    .withMessage("Valid payment method is required"),
  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage("Invalid status value"),
];

exports.eventValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("endDate")
    .isISO8601()
    .withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("location").optional().isString().withMessage("Location must be a string"),
  body("organizer").optional().isString().withMessage("Organizer must be a string"),
  body("ticketPrice").optional().isFloat({ min: 0 }).withMessage("Ticket price must be positive"),
  body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("images").optional().isArray().withMessage("Images must be an array"),
];

exports.promotionValidation = [
  body("place_id").isInt().withMessage("Place ID is required"),
  body("title").notEmpty().withMessage("Title is required"),
  body("discount_percent")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  body("start_date").isDate().withMessage("Valid start date is required"),
  body("end_date")
    .isDate()
    .withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_date)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

exports.userUpdateValidation = [
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .optional()
    .isIn(["admin", "user", "premium", "provider"])
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn(["active", "blocked", "inactive"])
    .withMessage("Invalid status"),
];

exports.searchValidation = [
  query("category")
    .optional()
    .isIn(["museums", "hotels", "restaurants", "historical", "attractions"])
    .withMessage("Invalid category"),
  query("near")
    .optional()
    .matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?(,\d+(\.\d+)?)?$/)
    .withMessage("Near parameter must be in format lat,lng[,distance]"),
  query("sort")
    .optional()
    .isIn(["rating", "name", "newest", "distance"])
    .withMessage("Invalid sort parameter"),
];
