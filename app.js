const express = require("express");
const app = express();
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: 'uploads/'});

require("dotenv").config();

const BoardsRouter = require("./routes/boards");

const User = require("./schemas/users");
const usersRouter = require("./routes/users");
const boardsRouter = require("./routes/boards");

const usersRouter = require("./routes/users");


mongoose.connect("mongodb://localhost/MiniProject", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));



app.use("/api", express.json(), router);
app.use("/api", BoardsRouter);

app.get("/", (req, res) => {
  res.send("Hi!");
});


app.use(cors());

app.use("/api", express.json(), usersRouter);

app.listen(8080, () => {
  console.log("서버가 켜졌어어요.");
});

module.exports = app;