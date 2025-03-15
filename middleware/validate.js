
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
  body("nom_place")
    .notEmpty()
    .withMessage("Place name is required")
    .isLength({ max: 255 })
    .withMessage("Name too long"),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description too long"),
  body("location")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Location too long"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("url_img").optional().isURL().withMessage("Invalid image URL"),
  body("url_web").optional().isURL().withMessage("Invalid website URL"),
  body("category")
    .optional()
    .isIn(["museums", "hotels", "restaurants", "historical", "attractions"])
    .withMessage("Invalid category"),
];

exports.idValidation = [param("id").isInt().withMessage("Invalid ID format")];

exports.reviewValidation = [
  body("place_id").isInt().withMessage("Place ID is required"),
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("comment")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Comment too long"),
];

exports.reservationValidation = [
  body("place_id").isInt().withMessage("Place ID is required"),
  body("reservation_date")
    .isDate()
    .withMessage("Valid reservation date is required"),
  body("start_time")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Start time must be in format HH:MM"),
  body("end_time")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("End time must be in format HH:MM"),
  body("num_guests")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Number of guests must be at least 1"),
];

exports.eventValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("place_id").optional().isInt().withMessage("Invalid place ID"),
  body("start_date").isISO8601().withMessage("Valid start date is required"),
  body("end_date")
    .isISO8601()
    .withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_date)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("status")
    .optional()
    .isIn(["upcoming", "ongoing", "past", "cancelled"])
    .withMessage("Invalid status"),
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
