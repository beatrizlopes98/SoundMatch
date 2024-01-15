const express = require("express");
const mongoConnection = require("./Connections/mongoDB").mongoConnection;

require("dotenv").config();
const app = express();
const port = process.env.PORT;

const auth = require("./Routes/authRoutes");
const user = require("./Routes/userRoutes");
const playlist = require("./Routes/playlistRoutes");
const admin = require("./Routes/adminRoutes");

app.use(express.json());

app.use("/", auth);
app.use("/user", user);
app.use("/playlist", playlist);
app.use("/admin", admin)

app.listen(port, () => {
  console.log("App is running on http://localhost:" + port);
});
