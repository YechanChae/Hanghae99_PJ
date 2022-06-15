// 모듈
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const basicAuth = require("express-basic-auth");

// 환경변수 설정
require("dotenv").config();
const port = process.env.PORT || 3000;

const commentRouter = require("./routes/comments");
const BoardsRouter = require("./routes/boards");
const usersRouter = require("./routes/users");

// 데이터베이스 세팅
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// swagger
const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'API in Swagger',
      version: '1.0.01'
    },
    servers: [
      {
        url: 'http://localhost:${process.env.PORT}'
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 미들웨어
app.use(cors());
app.use(express.json())
app.use("/api", [ BoardsRouter, commentRouter, usersRouter ]);

app.get("/", (req, res) => {
  res.send("Hi!");
});

// 서버 연결
app.listen(port, () => {
  console.log("서버가 켜졌어요.");
});

module.exports = app;