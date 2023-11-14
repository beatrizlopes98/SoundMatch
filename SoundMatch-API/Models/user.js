const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  seend: Array,
  likes: Array,
  playlistId: Array
});

const users = mongoose.model("users", userSchema);

exports.users = users;