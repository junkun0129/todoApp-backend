const { connection } = require("../db/mysql");
const { tables } = require("../../config").querys;
const { generateRandomString, getUserId } = require("../utils/common.util");
const jwt = require("jsonwebtoken");
const createReport = (req, res) => {
  const { title, body } = req.body;
  console.log(req.body, "body");
  const user_id = getUserId(req);
  console.log(user_id, "user_id");
  const reportId = generateRandomString(35);
  const sql = `insert into ${tables.reports} (report_id, user_id, title, body) values (?,?,?,?)`;
  const values = [reportId, user_id, title, body];
  connection.query(sql, values, (err, result) => {
    if (!result) {
      return res
        .status(200)
        .json({ message: "パスワードが違います", result: "failed" });
    } else {
      console.log(result);
    }
  });
};

const getReports = (req, res) => {
  const { date } = req.query;
  let sql = `SELECT r.title, u.user_name, u.img, r.created_at
  FROM ${tables.reports} r
  JOIN ${tables.users} u ON r.user_id = u.user_id
  WHERE 1=1
  `;

  if (date) {
    sql += `and created_at = ${date}`;
  }

  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    console.log(rows);
    return res.status(200).json({ result: "success", data: rows });
  });
};

module.exports = {
  createReport,
  getReports,
};
