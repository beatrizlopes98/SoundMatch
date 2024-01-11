const express = require("express");
const router = express.Router();

const utilities = require("../Services/utilities");
const authController = require("../Controllers/authController");
const authValidation = require("../Services/validation");

// Normal registration and login routes
router.post(
  "/register",
  authValidation.validateRegistration,
  (req, res) => {
    console.log("Post Register")
    authController.register(req, res)
  }
);

router.post("/login", (req, res) => {
  console.log("Post Login");
  authController.login(req, res);
});

// Google login route
router.get("/google", (req, res) => {
  console.log("Get Google");
  res.status(200).json({
    urlGoogle: utilities.urlGoogle()
  })
  //res.redirect(utilities.urlGoogle());
});

// Route to handle Google OAuth2.0 callback
router.get("/login", (req, res) => {
  console.log("Get Login");
  authController.login(req, res);
});

module.exports = router;
