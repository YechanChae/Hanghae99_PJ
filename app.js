const express = require("express");
// mongoose 패키지
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});
app.use("/api", express.json(), router);

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});