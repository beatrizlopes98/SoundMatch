const express = require("express");
const router = express.Router();
const validation = require("../Services/validation");
const playlistController = require("../Controllers/playlistController");
const { isAuthenticated } = require("../Services/middleware");

// Route to create a new playlist
// router.post(
//   "/create",
//   isAuthenticated,
//   validation.validatePlaylist,
//   (req, res) => {
//     playlistController.createPlaylist(req, res);
//   }
// );

router.get("/create", 
  isAuthenticated,
  (req, res) => {
    console.log("Post Create Playlist")
    res.status(200).json({
      user: req.user,
      message: "Hello World"
    })
  }
)

// Route to edit a playlist
router.put(
  "/edit/:playlistId",
  isAuthenticated,
  validation.validatePlaylist,
  (req, res) => {
    playlistController.editPlaylist(req, res);
  }
);

// Route to delete a playlist
router.delete(
  "/delete/:playlistId",
  isAuthenticated,
  (req, res) => {
    playlistController.deletePlaylist(req, res);
  }
);

module.exports = router;
