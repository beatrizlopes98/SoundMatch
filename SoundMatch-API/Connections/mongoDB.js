const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.MONGODB_URL


mongoose.connect(mongoDB);

const mongoConnection = mongoose.connection;

mongoConnection.on("error", () => {
  console.log("Connection to database failed");
});
mongoConnection.on("open", () => {
  console.log("Connected to database");
});

exports.mongoConnection = mongoConnection;