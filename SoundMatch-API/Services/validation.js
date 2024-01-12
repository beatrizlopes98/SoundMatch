const { param, body, validationResult } = require("express-validator");
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

// Validation middleware for editing user profile
exports.validateEditUser = [
  body("name").optional().notEmpty().isString().escape(),
  //body("email").optional().isEmail().notEmpty().escape(),
  body("password").optional().isLength({ min: 5, max: 15 }).notEmpty().escape(),
  exports.validateFields, // Adding common validation
];

// Validation middleware for adding or removing music from a playlist
exports.validateMusicId = [
  param("musicId").isMongoId().notEmpty().escape(),
  exports.validateFields, // Adding common validation
];

// Validation middleware for getting a specific playlist by ID
exports.validatePlaylistId = [
  param("playlistId").isMongoId().notEmpty().escape(),
  exports.validateFields, // Adding common validation
];

module.exports = exports;
