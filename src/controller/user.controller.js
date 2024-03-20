const { connection } = require("../db/mysql");
const editUserProfile = (req, res) => {
  const { email, firstName, lastName } = req.body;
  const sql =
    "UPDATE accounts SET first_name = ?, last_name = ? WHERE email = ?";
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
  const sql = "select * from accounts where email = ?";
  const values = [email];
  connection.query(sql, values, (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "取得できませんでした", result: "failed" });
    }
    if (rows) {
      return res.status(200).json({ result: "success", data: rows[0] });
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

module.exports = {
  editUserProfile,
  getUserProfile,
  updateImage,
};
