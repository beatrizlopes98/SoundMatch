const express = require("express");
const router = express.Router();
const validation = require("../Services/validation");
const playlistController = require("../Controllers/playlistController");
const { isAuthenticated } = require("../Services/middleware");


// Route to get all playlists of the logged-in user
router.get("/all", isAuthenticated, (req, res) => {
  playlistController.getAllPlaylists(req, res);
});

// Route to get a specific playlist by ID
router.get(
  "/:playlistId",
  isAuthenticated,
  //validation.validateObjectIdParams,
  (req, res) => {
    playlistController.getPlaylistById(req, res);
  }
);

// Route to create a new playlist
router.post(
  "/create",
  isAuthenticated,
  validation.validateCreatePlaylist,
  (req, res) => {
    playlistController.createPlaylist(req, res);
  }
);

// Route to edit a playlist
router.put(
  "/edit/:playlistId",
  isAuthenticated,
  validation.validateEditPlaylist,
  (req, res) => {
    playlistController.editPlaylist(req, res);
  }
);

// Route to delete a playlist
router.delete("/delete/:playlistId", isAuthenticated, (req, res) => {
  playlistController.deletePlaylist(req, res);
});

// Route to add or remove music from a playlist
router.put(
  "/:playlistId/:musicId",
  isAuthenticated,
  //validation.validateObjectIdParams,
  (req, res) => {
    playlistController.addRemoveMusicFromPlaylist(req, res);
  }
);

module.exports = router;
