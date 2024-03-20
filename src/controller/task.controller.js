const { connection } = require("../db/mysql");
const getAllTasks = (req, res) => {
  const sql = "select * from tasks";
  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    return res.status(200).json({ result: "success", data: rows });
  });
};

const createTask = (req, res) => {
  const { title, description } = req.body;
  const sql = `INSERT INTO tasks (title, description, status) VALUES (?, ?, 'todo')`;
  connection.query(sql, [title, description], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "データの挿入中にエラーが発生しました。" });
    }

    return res.status(200).json({ result: "success" });
  });
};

const deleteTask = (req, res) => {
  const { id } = req.body;
  const sql = `DELETE FROM tasks WHERE task_id = ?`;
  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "データの削除中にエラーが発生しました。" });
    }
    return res.status(200).json({ result: "success" });
  });
};

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
};
