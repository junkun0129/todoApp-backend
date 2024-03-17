const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/auth", require("./src/routes/auth.route"));
app.use("/test", require("./src/routes/test.route"));
app.use("/task", require("./src/routes/task.route"));

http.listen(3000, () => {
  console.log("listen....");
});
