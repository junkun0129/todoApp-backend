const { connection } = require("../db/mysql");
const {
  generateRandomString,
  postRequestHandler,
  getUserId,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../utils/common.util");
const { tables } = require("../../config").querys;
const getAllTasks = (req, res) => {
  const userId = getUserId(req);
  const sql = `select t.task_id, t.title, t.status, t.created_at, t.task_order, u.user_name, u.img
  from ${tables.tasks} t
  join ${tables.users} u ON t.user_id = u.user_id
  where t.user_id = ?
  `;
  console.log(sql);
  const values = [userId];
  console.log(values, "values");
  connection.query(sql, values, (err, rows) => {
    if (err) {
      console.log(err, "failllllllllll");
      return res.status(500).json({ message: "", result: "failed" });
    }
    console.log("successsss");
    return res.status(200).json({ result: "success", data: rows });
  });
};

const getTaskDetail = (req, res) => {
  const { task_id } = req.body;
  const sql = `
  select t.task_id, t.title, t.body, t.status, t.created_at, u.user_name, u.img
  from ${tables.tasks} t
  join ${tables.users} u ON t.user_id = u.user_id
  where task_id = ?
  `;
  console.log("ldldlddldldldldldl");
  const values = [task_id];
  connection.query(sql, values, (err, rows) => {
    console.log(err);
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
  set status = ?, title = ?, body = ?
  where task_id = ?
  `;
  const values = [status, title, body, task_id];
  connection.query(sql, values, (err, result) => {
    console.log(result);
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

const changeTaskOrder = (req, res) => {
  const { status, order } = req.body;
};

const createTask = (req, res) => {
  const { title, body } = req.body;
  console.log("ldlldddddlddddldddddddlddlddl");
  const userId = getUserId(req);
  const taskId = generateRandomString(35);
  const sqll = `select * from tasks where status = 'NEW'`;
  connection.query(sqll, (err, rows) => {
    console.log(rows, "rowssssssss");
    const order = rows.length + 1 ?? 1;
    console.log(order, "orderrrr");
    const values = [taskId, userId, title, body, "NEW", order];
    console.log(values);
    const sql = `insert into ${tables.tasks} (task_id, user_id, title, body, status, task_order) values (?, ?, ?, ?, ?, ?)`;
    connection.query(sql, values, (err, result) => {
      postRequestHandler(err, result, res);
    });
  });
};

const updateOrderAndStatus = async (req, res) => {
  const { status, task_id, order } = req.body;
  console.log("object");
  try {
    await beginTransaction(connection);
    await updateTasks(connection, status, order, task_id);
    await commitTransaction(connection);
    return res.status(200).json({ message: "成功しました", result: "success" });
  } catch (err) {
    await rollbackTransaction(connection);
    return res.status(500).json({ message: "失敗しました", result: "failed" });
  }
};

function updateTasks(connection, newStatus, newOrder, task_id) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE tasks SET task_order = task_order + 1 WHERE status = ? AND task_order >= ?",
      [newStatus, newOrder],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        console.log(results);
        connection.query(
          "UPDATE tasks SET status = ?, task_order = ? WHERE task_id = ?",
          [newStatus, newOrder, task_id],
          (error, results) => {
            if (error) {
              return reject(error);
            }
            console.log(results);
            resolve();
          }
        );
      }
    );
  });
}

module.exports = {
  getAllTasks,
  getTaskDetail,
  createTask,
  updateTask,
  deleteTask,
  updateOrderAndStatus,
};
