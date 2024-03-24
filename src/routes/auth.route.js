const router = require("express").Router();
const session = require("express-session");
const controller = require("../controller/auth.contorller");
const config = require("../../config");
const { connection } = require("../db/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
router.post("/signup", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const sql = "select * from USERS where email = ?";
  connection.query(sql, [email], (err, rows) => {
    console.log(rows, "rows");

    if (!rows || rows.length === 0) {
      const sql = `
      INSERT INTO USERS (first_name, last_name, email, password, img) 
      VALUES (?, ?, ?, ?, ?)
      `;

      const encodedPassword = bcrypt.hashSync(password, 10);
      const imageUrl = "";
      const values = [firstName, lastName, email, encodedPassword, imageUrl];
      console.log(values, "values");
      connection.query(sql, values, (err, result) => {
        if (err) {
          console.log("errors", err);
          return res
            .status(500)
            .json({ message: "データベースとの接続に失敗しました" });
        }

        return res
          .status(200)
          .json({ message: "ユーザーの登録に成功しました", result: "success" });
      });
    } else {
      return res.status(200).json({
        message: "同じメールアドレスがすでに使われています",
        result: "failed",
      });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, password, is_stay_login } = req.body;
  const sql = "select * from USERS where email = ?";
  const value = email;
  connection.query(sql, value, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "errr", result: "failed" });
    }
    if (!rows.length) {
      return res.status(200).json({
        message: "そのメールアドレスで登録されているアカウントはありません",
        result: "failed",
      });
    } else {
      const user = rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          return res
            .status(200)
            .json({ message: "パスワードが違います", result: "failed" });
        } else {
          const payload = {
            email: user.email,
          };
          const token = jwt.sign(payload, config.jwt.secret, {
            algorithm: config.jwtAlgorithm,
            expiresIn: is_stay_login ? config.expiresLong : config.expiresShort,
          });
          return res.status(200).json({
            message: "ログインに成功しました",
            result: "success",
            data: {
              user: {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                img: process.env.BASE_DOMAIN + "/image/" + user.img,
              },
              token,
            },
          });
        }
      });
    }
  });
});
module.exports = router;

// INSERT INTO テーブル名 (task_id, user_id, taskgroup_id, title, description, status, created_at)
// VALUES (1, 1, 1, 'タイトル', '説明', 'new', CURRENT_TIMESTAMP);

// INSERT INTO USERS (first_name, last_name, email, password, img)
// VALUES ('John', 'Doe', 'john@example.com', 'password123', '/image/user_profile/john@example.com');
