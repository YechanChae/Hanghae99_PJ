const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const port = process.env.PORT || 3000;

const commentRouter = require("./routes/comments");
const BoardsRouter = require("./routes/boards");
const usersRouter = require("./routes/users");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use(cors());
app.use(express.json())
app.use("/api", [ BoardsRouter, commentRouter, usersRouter ]);

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () => {
  console.log("서버가 켜졌어어요.");
});

module.exports = app;