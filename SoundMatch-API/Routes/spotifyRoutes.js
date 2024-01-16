const express = require("express");
const router = express.Router();
const spotifyController = require("../Controllers/spotifyController");
const { isAuthenticated, isConnected } = require("../Services/middleware");

// Route to get public playlists
router.get("/playlists", isAuthenticated, isConnected, (req, res) => {
  console.log("Get Public Playlists");
  spotifyController.getPlaylists(req, res);
});

// Route to get public playlists
router.get("/playlistById", isAuthenticated, isConnected, (req, res) => {
  console.log("Get Private Playlists");
  spotifyController.getPrivatePlaylists(req, res);
});

// Route to get genres
router.get("/recomendations/genres", isAuthenticated, isConnected, (req, res) => {
    console.log("Get Recomendation Genres");
    spotifyController.getRecomendationGenres(req, res);
  });

// Route to get recomendations
router.get("/recomendations", isAuthenticated, isConnected, (req, res) => {
    console.log("Get Recomendation");
    spotifyController.getRecomendations(req, res);
  });

// Route to get music info
router.get("/music", isAuthenticated, isConnected, (req, res) => {
    console.log("Get Music");
    spotifyController.getMusic(req, res);
  });

  // Route to get multiple musics infos
router.get("/musics", isAuthenticated, isConnected, (req, res) => {
    console.log("Get Multiple Musics");
    spotifyController.getMusic(req, res);
  });

module.exports = router;
