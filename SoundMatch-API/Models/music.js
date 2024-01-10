const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  name: String,
  artist: String,
  album: String,
  imageURL: String,
  previewURL: String,
  duration: Number,
  gender: Array
});

const musics = mongoose.model("musics", musicSchema);

exports.musics = musics;

