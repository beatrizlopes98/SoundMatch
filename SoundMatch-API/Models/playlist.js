const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  music: Array,
  title: String,
  imageCover: String,
  externalUrl: String,
  spotifyId: String,
  userId: String
});

const playlists = mongoose.model("playlists", playlistSchema);

exports.playlists = playlists;
