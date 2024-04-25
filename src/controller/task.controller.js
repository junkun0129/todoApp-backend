const { connection } = require("../db/mysql");
const {
  generateRandomString,
  postRequestHandler,
  getUserId,
} = require("../utils/common.util");
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

const getTaskDetail = (req, res) => {
  const { task_id } = req.body;
  const sql = `
  select t.task_id t.title t.body t.status t.created_at u.user_name u.img
  from ${tables.tasks} t
  join ${tables.users} u ON t.user_id = user_id
  where task_id = ?
  `;
  const values = [task_id];
  connection.query(sql, values, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    if (!rows) {
      return res.status(200).json({ message: "", result: "no task in db" });
    } else {
      return res.status(200).json({ result: "success", data: rows[0] });
    }
  });
};

const updateTask = (req, res) => {
  const { task_id, title, body, status } = req.body;
  const sql = `
  update ${tables.tasks}
  set status = ? title = ? body = ?
  where task_id = ?
  `;
  const values = [status, title, body, task_id];
  connection.query(sql, values, (err, result) => {
    postRequestHandler(err, result, res);
  });
};

const deleteTask = (req, res) => {
  const { task_id } = req.body;
  const sql = `
  delete from ${tables.tasks}
  where task_id = ?
  `;
  const values = [task_id];
  connection.query(sql, values, (err, result) => {
    postRequestHandler(err, result, res);
  });
};

const createTask = (req, res) => {
  const { title, body } = req.body;
  console.log("ldlldddddlddddldddddddlddlddl");
  const userId = getUserId(req);
  const taskId = generateRandomString(35);
  const values = [taskId, userId, title, body, "NEW"];
  const sql = `insert into ${tables.tasks} (task_id, user_id, title, body, status) values (?, ?, ?, ?, ?)`;
  connection.query(sql, values, (err, result) => {
    postRequestHandler(err, result, res);
  });
};

module.exports = {
  getAllTasks,
  getTaskDetail,
  createTask,
  updateTask,
  deleteTask,
};
