const { connection } = require("../db/mysql");
const { generateRandomString } = require("../utils/common.util");
const { tables } = require("../../config").querys;
const getAllTasks = (req, res) => {
  const sql = `select t.task_id t.title t.status t.created_at u.user_name u.img
  from ${tables.tasks} t
  join ${tables.users} u ON t.user_id = user_id
  where 1=1
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    return res.status(200).json({ result: "success", data: rows });
  });
};

const createTask = (req, res) => {
  const { user_id, title, body } = req.body;
  const taskId = generateRandomString(35);
  const values = [taskId, user_id, title, body, "NEW"];
  const sql = `insert into ${tables.tasks} (task_id, user_id, title, body, status) values (?, ?, ?, ?, ?)`;
  connection.query(sql, values, (err, result) => {
    if (!result) {
      return res
        .status(200)
        .json({ message: "失敗しました", result: "failed" });
    } else {
      console.log(result);
      return res.status(200).json({ result: "success" });
    }
  });
};

module.exports = {
  getAllTasks,
  createTask,
};
