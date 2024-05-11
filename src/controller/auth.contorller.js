const bcrypt = require("bcrypt");
const { connection } = require("../db/mysql");
const jwt = require("jsonwebtoken");
const { tables } = require("../../config").querys;
const { generateRandomString } = require("../utils/common.util");
const config = require("../../config");
const signup = (req, res) => {
  console.log("object");
  const { email, password, user_name } = req.body;
  console.log(req.body);
  const sql = "select * from USERS where email = ?";
  connection.query(sql, [email], (err, rows) => {
    console.log(rows, "rows");

    if (!rows || rows.length === 0) {
      const sql = `
        INSERT INTO ${tables.users} (user_id, user_name, email, password, img) 
        VALUES (?,?, ?, ?, ?)
        `;

      const encodedPassword = bcrypt.hashSync(password, 10);
      const imageUrl = "";
      const generatedId = generateRandomString(35);
      const values = [generatedId, user_name, email, encodedPassword, imageUrl];
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
};

const signin = (req, res) => {
  console.log("object");
  const { email, password, is_stay_login } = req.body;
  console.log(req.body);
  const sql = `select * from ${tables.users} where email = ?`;
  const value = email;
  connection.query(sql, value, (err, rows) => {
    console.log(rows, "rows");
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
      console.log(user, "user");
      bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
          return res
            .status(200)
            .json({ message: "パスワードが違います", result: "failed" });
        } else {
          const payload = {
            user_id: user.user_id,
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
                user_name: user.user_name,
                img: process.env.BASE_DOMAIN + "/image/" + user.img,
              },
              token,
            },
          });
        }
      });
    }
  });
};

module.exports = {
  signin,
  signup,
};
