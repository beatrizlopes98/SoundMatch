const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  playlistId: String,
  music: Array,
  title: String,
  imageCover: String,
  userId: String
});

const playlists = mongoose.model("playlists", playlistSchema);

exports.playlists = playlists;
