const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();

mongoose.connect("mongodb://localhost/hanghae99_week4HW", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const usersRouter = require("./routes/users")
const authMiddleware = require("./routes/auth-middleware")


app.use(express.json())


app.get("/", (req, res) => {
  res.send("Hi!");
});
app.use("/api", express.urlencoded({ extended: false }), [usersRouter])

app.listen(8080, () => {
  console.log("서버가 켜졌어요.");
});