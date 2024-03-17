const router = require("express").Router();
const session = require("express-session");
const controller = require("../controller/auth.contorller");
const config = require("../../config");
const { connection } = require("../db/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/signup", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const sql = "select * from accounts where email = ?";
  connection.query(sql, [email], (err, rows) => {
    if (rows.length) {
      res
        .status(200)
        .json({ message: "同じメールアドレスがすでに使われています" });
    } else {
      const sql = `
        INSERT INTO accounts (email, password_hash, first_name, last_name, profile_image_url, role, last_login_date) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
      const encodedPassword = bcrypt.hashSync(password, 10);
      const values = [email, encodedPassword, firstName, lastName, "", "user"];
      connection.query(sql, values, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ message: "データベースとの接続に失敗しました" });
        }

        res
          .status(200)
          .json({ message: "ユーザーの登録に成功しました", result: "success" });
      });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, password, is_stay_login } = req.body;
  const sql = "select * from accounts where email = ?";
  const value = email;
  connection.query(sql, value, (err, rows) => {
    if (!rows.length) {
      res.status(200).json({
        message: "そのメールアドレスで登録されているアカウントはありません",
        result: "failed",
      });
    } else {
      const user = rows[0];
      bcrypt.compare(password, user.password_hash, (err, result) => {
        if (!result) {
          res
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
          res.status(200).json({
            message: "ログインに成功しました",
            result: "success",
            data: {
              user: {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                img: user.profile_image_url,
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
