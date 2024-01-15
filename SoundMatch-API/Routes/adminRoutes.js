const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");
const { isAuthenticated, isAdmin } = require("../Services/middleware");

// Route to get all playlists
router.get("/playlists",isAuthenticated, isAdmin, (req, res) => {
  console.log("Get All Playlists");
  adminController.getAllPlaylists(req, res);
});

// Route to get all users
router.get("/users",isAuthenticated, isAdmin, (req, res) => {
  console.log("Get All Users");
  adminController.getAllUsers(req, res);
});

// Route to get all musics
router.get("/musics",isAuthenticated, isAdmin, (req, res) => {
  console.log("Get All Musics");
  adminController.getAllMusics(req, res);
});

// Route to delete all users
router.delete("/users",isAuthenticated, isAdmin, (req, res) => {
  console.log("Delete All Users");
  adminController.deleteAllUsers(req, res);
});

// Route to delete all musics
router.delete("/musics",isAuthenticated, isAdmin, (req, res) => {
  console.log("Delete All Musics");
  adminController.deleteAllMusics(req, res);
});

// Route to delete all playlists
router.delete("/playlists",isAuthenticated, isAdmin, (req, res) => {
  console.log("Delete All Playlists");
  adminController.deleteAllPlaylists(req, res);
});

module.exports = router;
