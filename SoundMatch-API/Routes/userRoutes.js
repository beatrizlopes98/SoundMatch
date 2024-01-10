const express = require("express");
const router = express.Router();
const validation = require("../Services/validation");
const userController = require("../Controllers/userController");
const { isAuthenticated } = require("../Services/middleware");

// Route to add seen music to user profile
router.post(
  "/add-seen/:musicId",
  isAuthenticated,
  validation.validateMusicId,
  (req, res) => {
    userController.addSeenMusic(req, res);
  }
);

// Route to add liked music to user profile
router.post(
  "/add-liked/:musicId",
  isAuthenticated,
  validation.validateMusicId,
  (req, res) => {
    userController.addLikedMusic(req, res);
  }
);

module.exports = router;
