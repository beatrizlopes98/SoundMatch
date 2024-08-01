const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  genres: Array,
  seens: Array,
  likes: Array,
  playlistId: Array,
});

const users = mongoose.model("users", userSchema);

exports.users = users;
