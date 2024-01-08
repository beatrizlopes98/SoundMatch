const { body, validationResult } = require("express-validator");
const { handleError } = require("../Services/error");

// Validation middleware for user registration
exports.validateRegistration = [
  body("name").notEmpty().escape(),
  body("email").isEmail().notEmpty().escape(),
  body("password").isLength({ min: 5, max: 15 }).notEmpty().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleError(res, 400, errors.array());
    }
    next();
  },
];
