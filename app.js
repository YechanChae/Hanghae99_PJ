const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
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

router.get("/", (req, res) => {
  res.send("Hi!");
});
app.use("/api", express.json(), router);

app.listen(8080, () => {
  console.log("서버가 켜졌어어요.");
});