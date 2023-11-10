const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  musicId: String,
  artist: String,
  album: String,
  imageCover: String,
  duration: Number,
  gender: Array
});

const musics = mongoose.model("musics", musicSchema);

exports.muscis = musics;

