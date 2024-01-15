const express = require("express");
const router = express.Router();

const utilities = require("../Services/utilities");
const authController = require("../Controllers/authController");
const authValidation = require("../Services/validation");

// Request Body register route
router.post("/register", authValidation.validateRegistration, (req, res) => {
  console.log("Post Register");
  authController.register(req, res);
});

// Request Body login route
router.post("/login", authValidation.validateLogin, (req, res) => {
  console.log("Post Login");
  authController.login(req, res);
});

// Google login route
router.get("/google", (req, res) => {
  console.log("Get Google");
  res.status(200).json({
    urlGoogle: utilities.urlGoogle(),
  });
  //res.redirect(utilities.urlGoogle());
});

// Route to handle Google OAuth2.0 callback
router.get("/callbackGoogle", (req, res) => {
  console.log("Callback Google");
  authController.login(req, res);
});

// Spotify login route
router.get("/spotify", (req, res) => {
  console.log("Get Spotify");
  res.status(200).json({
    urlSpotify: utilities.generateSpotifyAuthUrl()
  });
  //res.redirect(spotifyAuthUrl);
});

// Route to handle Spotify OAuth2.0 callback
router.get("/callbackSpotify", async (req, res) => {
  try {
    console.log("Callback Spotify");
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    const spotifyTokens = await utilities.generateSpotifyAccessToken(code);

    res.status(200).json({
      token: spotifyTokens,
      message: "Successfully obtained Spotify access token",
    });
  } catch (error) {
    console.error("Error handling Spotify callback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
