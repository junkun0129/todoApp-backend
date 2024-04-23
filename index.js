const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const etag = require("etag");
const { loadManifest } = require("./images");
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(cors());
require("dotenv").config();
const imageDir = path.join(__dirname, "src", "user_folders");
// app.use("/image", express.static(imageDir));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", require("./src/routes/auth.route"));
app.use("/test", require("./src/routes/test.route"));
app.use("/task", require("./src/routes/task.route"));
app.use("/report", require("./src/routes/report.route"));
app.use("/user", require("./src/routes/user.route"));
app.get("/image/:filename", (req, res) => {
  const imagePath = path.join(imageDir, req.params.filename);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send("File not found");
  }

  // ファイルのEtagを生成
  const fileStats = fs.statSync(imagePath);
  const fileEtag = etag(fileStats);

  // リクエストヘッダーのIf-None-MatchとEtagを比較
  const clientEtag = req.headers["if-none-match"];

  console.log(clientEtag, "cliendetag");
  console.log(fileEtag, "fileetag");
  if (clientEtag === fileEtag) {
    // Etagが一致する場合は304 Not Modifiedを返す
    return res.status(304).end();
  }

  // Etagが一致しない場合はファイルを送信
  res.set("ETag", fileEtag); // レスポンスヘッダーにEtagを設定
  res.set("Pragma", "no-cache");
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0"
  );

  res.sendFile(imagePath);
});

if (!fs.existsSync(imageDir)) {
  process.exit(1); // アプリケーションを終了
}

http.listen(3000, () => {
  console.log("listen....");
  loadManifest();
});
