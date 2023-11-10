const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  password: String,
  seendId: Array,
  likesId: Array,
  playlistId: Array
});

const users = mongoose.model("users", userSchema);

exports.users = users;