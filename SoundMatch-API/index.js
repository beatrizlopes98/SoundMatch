const express = require("express");
const mongoConnection = require("./Connections/mongoDB").mongoConnection;

require("dotenv").config();
const app = express();
const port = process.env.PORT


app.use(express.json());

app.listen(port, () => {
  console.log("App is running on http://localhost/:" + port);
});