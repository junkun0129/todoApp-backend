const { connection } = require("../db/mysql");
const jwt = require("jsonwebtoken");
const { tables } = require("../../config").querys;
const editUserProfile = (req, res) => {
  const { email, firstName, lastName } = req.body;
  const sql = "UPDATE USERS SET first_name = ?, last_name = ? WHERE email = ?";
  const values = [firstName, lastName, email];

  connection.query(sql, values, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "変更できませんでした", result: "failed" });
    }
    return res.status(200).json({ result: "success" });
  });
};

const getUserProfile = (req, res) => {
  const { email } = req.body;
  const sql = `select * from ${tables.users} where email = ?`;
  const values = [email];
  connection.query(sql, values, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "取得できませんでした", result: "failed" });
    }
    if (rows) {
      const user = rows[0];
      const data = {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        img: process.env.BASE_DOMAIN + "/image/" + user.img,
      };
      return res.status(200).json({ result: "success", data });
    } else {
      return res
        .status(500)
        .json({ message: "取得できませんでした", result: "failed" });
    }
  });
};

const updateImage = (req, res) => {
  console.log("----------------------------------");
  console.log(req.file, "kkkdkdkdkkdk");
  res.status(200).json({ message: "oi" });
};

const updateProfileImage = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token, { complete: true });
  const userEmail = decodedToken.payload.email;
  const imageFile = req.files.file;
  const imageName = userEmail + "." + imageFile.name.split(".")[1];
  let uploadPath = __dirname + "/.." + "/user_folders/" + imageName;
  imageFile.mv(uploadPath, (err) => {
    if (err) return res.status(500);
    const sql = `update ${tables.users} set img = ? where email = ?`;
    const timestamp =
      new Date().getTime() + Math.floor(Math.random() * 1000000);

    const updatedimgName = imageName + "?tm=" + timestamp;

    const values = [updatedimgName, userEmail];
    connection.query(sql, values, (err, result) => {
      if (err) return res.status(500);
      return res
        .status(200)
        .json({ result: "success", message: "画像の保存に成功しました" });
    });
  });
  if (!req.files) {
    console.log("no file data");
    return res.status(400).json({ message: "ファイルが見つかりませんでした" });
  }
};

const getUserList = (req, res) => {
  const sql = `select email, user_id, user_name, img from ${tables.users}`;
  connection.query(sql, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "取得できませんでした", result: "failed" });
    }
    return res.status(200).json({ result: "success", data: rows });
  });
};

module.exports = {
  editUserProfile,
  getUserProfile,
  updateImage,
  updateProfileImage,
  getUserList,
};
