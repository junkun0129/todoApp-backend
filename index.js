require("./src/db/mysql");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/auth", require("./src/routes/auth.route"));
app.use("/test", require("./src/routes/test.route"));
app.use("", (req, res, next) => {
  return res.send("<h1>iskl</h1>");
});
http.listen(3000, () => {
  console.log("listen....");
});
