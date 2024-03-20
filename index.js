const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const path = require("path");
const fs = require("fs");
app.use(cors());
require("dotenv").config();
const imageDir = path.join(__dirname, "src", "user_folders");
app.use(
  "/image",
  (req, res, next) => {
    // Cache-Controlヘッダーを設定してキャッシュを制御
    res.set("Cache-Control", "no-cache");
    next();
  },
  express.static(imageDir)
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", require("./src/routes/auth.route"));
app.use("/test", require("./src/routes/test.route"));
app.use("/task", require("./src/routes/task.route"));
app.use("/user", require("./src/routes/user.route"));
if (!fs.existsSync(imageDir)) {
  process.exit(1); // アプリケーションを終了
}

http.listen(3000, () => {
  console.log("listen....");
});
