const express = require("express");
const mongoConnection = require("./Connections/mongoDB").mongoConnection;

require("dotenv").config();
const app = express();
const port = process.env.PORT

const auth = require("./Routes/authRoutes")

app.use(express.json());

app.use("/", auth)

app.listen(port, () => {
  console.log("App is running on http://localhost:" + port);
});