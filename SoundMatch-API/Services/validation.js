const { body, validationResult } = require("express-validator");
const { handleError } = require("../Services/error");

// Common validation middleware for all routes
exports.validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleError(res, 400, errors.array());
  }
  next();
};

// Validation middleware for user registration
exports.validateRegistration = [
  body("name").notEmpty().isString().escape(),
  body("email").isEmail().notEmpty().escape(),
  body("password").isLength({ min: 5, max: 15 }).notEmpty().escape(),
  exports.validateFields, // Adding common validation
];

// Validation middleware for adding seen or liked music
exports.validateMusicId = [
  body("musicId").notEmpty().isString().escape(),
  exports.validateFields, // Adding common validation
];

// Validation middleware for creating a playlist
exports.validateCreatePlaylist = [
  body("title").notEmpty().isString().escape(),
  body("imageCover").optional().notEmpty().isString().escape(),
  exports.validateFields, // Adding common validation
];

// Validation middleware for editing a playlist
exports.validateEditPlaylist = [
  body("title").optional().notEmpty().isString().escape(),
  body("imageCover").optional().notEmpty().isString().escape(),
  exports.validateFields, // Adding common validation
];

module.exports = exports;
