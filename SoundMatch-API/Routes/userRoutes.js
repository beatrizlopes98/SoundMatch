const express = require("express");
const router = express.Router();
const validation = require("../Services/validation");
const userController = require("../Controllers/userController");
const { isAuthenticated } = require("../Services/middleware");

// Route to get user profile
router.get("/profile", isAuthenticated, (req, res) => {
  console.log("Get Profile")
  userController.getUserProfile(req, res);
});

// Route to edit user profile
router.put(
  "/edit",
  isAuthenticated,
  validation.validateEditUser,
  (req, res) => {
    console.log("Edit Profile")
    userController.editUserProfile(req, res);
  }
);

// Route to add music to seens
router.post(
  "/add-seen/:musicId",
  isAuthenticated,
  validation.validateMusicId,
  (req, res) => {
    console.log("Add Music to Seens")
    userController.addMusicToSeen(req, res);
  }
);

// Route to add music to likes
router.post(
  "/add-liked/:musicId",
  isAuthenticated,
  validation.validateMusicId,
  (req, res) => {
    console.log("Add/Remove Music to Likes")
    userController.addMusicToLikes(req, res);
  }
);

module.exports = router;
