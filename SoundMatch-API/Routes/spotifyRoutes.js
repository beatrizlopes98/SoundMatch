const express = require("express");
const router = express.Router();
const spotifyController = require("../Controllers/spotifyController");
const { isAuthenticated, isConnected } = require("../Services/middleware");

// Route to get logged user info
router.get("/profile", isAuthenticated, isConnected, (req, res) => {
  console.log("Get Connected User Info");
  spotifyController.getLoggedUserInfo(req, res);
});

module.exports = router;
