const express = require("express");
const router = express.Router();
const spotifyController = require("../Controllers/spotifyController");
const { isAuthenticated, isConnected } = require("../Services/middleware");

// Route to get public playlists
router.get("/playlists", isAuthenticated, isConnected, (req, res) => {
  console.log("Get Playlists");
  spotifyController.getSpotifyPlaylists(req, res);
});

// Route to get public playlists
router.get(
  "/playlist/:playlistId",
  isAuthenticated,
  isConnected,
  (req, res) => {
    console.log("Get Playlist By Id");
    spotifyController.getSpotifyPlaylistById(req, res);
  }
);

// Route to get recommendations
router.get("/recommendations", isAuthenticated, isConnected, (req, res) => {
  console.log("Get Recommendation");
  spotifyController.getRecommendations(req, res);
});

// Route to get genres
router.get(
  "/recommendations/genres",
  isAuthenticated,
  isConnected,
  (req, res) => {
    console.log("Get Recommendation Genres");
    spotifyController.getRecommendationGenres(req, res);
  }
);

// // Route to get music info
// router.get("/music", isAuthenticated, isConnected, (req, res) => {
//     console.log("Get Music");
//     spotifyController.getMusic(req, res);
//   });

//   // Route to get multiple musics infos
// router.get("/musics", isAuthenticated, isConnected, (req, res) => {
//     console.log("Get Multiple Musics");
//     spotifyController.getMusic(req, res);
//   });

module.exports = router;
