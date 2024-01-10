const express = require("express");
const mongoConnection = require("./Connections/mongoDB").mongoConnection;

require("dotenv").config();
const app = express();
const port = process.env.PORT;

const auth = require("./Routes/authRoutes");
const playlist = require("./Routes/playlistRoutes");
const user = require("./Routes/userRoutes");

app.use(express.json());

app.use("/", auth);
app.use("/playlist", playlist);
app.use("/user", user);

// app.get("/home", isAuthenticated, function (req, res) {
//   res.status(200).send("Welcome to the Home Page")
// });

app.listen(port, () => {
  console.log("App is running on http://localhost:" + port);
});
