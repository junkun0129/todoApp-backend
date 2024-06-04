const { connection } = require("../db/mysql");
const {
  generateRandomString,
  postRequestHandler,
  getUserId,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  transaction,
} = require("../utils/common.util");
const { tables } = require("../../config").querys;

const getAllTasksApi = (req, res) => {
  const userId = getUserId(req);
  const sql = `select t.task_id, t.title, t.status, t.created_at, t.task_order, u.user_name, u.img
  from ${tables.tasks} t
  join ${tables.users} u ON t.user_id = u.user_id
  where t.user_id = ?
  `;
  const values = [userId];
  connection.query(sql, values, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    return res.status(200).json({ result: "success", data: rows });
  });
};

const getTaskDetailApi = (req, res) => {
  const { task_id } = req.body;
  transaction(connection, res, async () => {
    const detailedTask = await getTaskDetail(task_id);
    if (!detailedTask) {
      return res.status(500).json({ message: "", result: "failed" });
    } else {
      const comments = await getTaskComments(task_id);
      detailedTask["comments"] = comments;
      return res.status(200).json({ result: "success", data: detailedTask });
    }
  });
};

function getTaskDetail(task_id) {
  return new Promise((resolve, reject) => {
    const sql = `
  select t.task_id, t.title, t.body, t.status, t.created_at, u.user_name, u.img
  from ${tables.tasks} t
  join ${tables.users} u ON t.user_id = u.user_id
  where task_id = ?
  `;

    const values = [task_id];
    connection.query(sql, values, (err, rows) => {
      if (err) {
        reject(err);
      }
      if (!rows.length) {
        resolve(null);
      } else {
        resolve(rows[0]);
      }
    });
  });
}

function getTaskComments(task_id) {
  return new Promise((resolve, reject) => {
    const sql = `
    select tc.taskcomment_id, tc.body, tc.created_at, u.user_name, u.img 
    from ${tables.taskcomments} tc
    join ${tables.users} u ON tc.user_id = u.user_id
    where task_id = ?`;
    const values = [task_id];
    connection.query(sql, values, (err, rows) => {
      console.log(err, "kdkkd");
      console.log(rows, "rowwswsssssss");
      if (err) {
        reject(err);
      }
      return resolve(rows);
    });
  });
}

const createTaskCommentApi = (req, res) => {
  const { user_id, task_id, body } = req.body;
  transaction(connection, res, async () => {
    const result = await createTaskComment(user_id, task_id, body);
    console.log(result, "result");
    return res.status(200).json({ result: "success" });
  });
};

function createTaskComment(user_id, task_id, body) {
  return new Promise((resolve, reject) => {
    const primaryKey = generateRandomString(35);
    const sql = `insert into ${tables.taskcomments} (taskcomment_id, task_id, user_id, body) values(?, ?, ?, ?)`;
    const values = [primaryKey, task_id, user_id, body];
    connection.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
}

const updateTaskApi = (req, res) => {
  const { task_id, title, body, status } = req.body;
  const sql = `
  update ${tables.tasks}
  set status = ?, title = ?, body = ?
  where task_id = ?
  `;
  const values = [status, title, body, task_id];
  connection.query(sql, values, (err, result) => {
    postRequestHandler(err, result, res);
  });
};

const deleteTaskApi = (req, res) => {
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

const createTaskApi = (req, res) => {
  const { title, body, status } = req.body;

  transaction(connection, res, async () => {
    const order = await getTasksByStatus(status);
    const userId = getUserId(req);
    await createTask(userId, title, body, status);

    return res.status(200).json({ message: "成功しました", result: "success" });
  });
};

function getTasksByStatus(status) {
  return new Promise((resolve, reject) => {
    const sql = `select * from tasks where status = ?`;
    const values = [status];
    connection.query(sql, values, (err, rows) => {
      if (err) {
        reject(err);
      }
      const order = rows.length + 1 || 1;
      resolve(order);
    });
  });
}

function createTask(userId, title, body, status, order) {
  return new Promise((resolve, reject) => {
    const taskId = generateRandomString(35);

    const values = [taskId, userId, title, body, status, order];
    const sql = `insert into ${tables.tasks} (task_id, user_id, title, body, status, task_order) values (?, ?, ?, ?, ?, ?)`;
    connection.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

const updateOrderAndStatus = async (req, res) => {
  const { status, task_id, order } = req.body;
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
        connection.query(
          "UPDATE tasks SET status = ?, task_order = ? WHERE task_id = ?",
          [newStatus, newOrder, task_id],
          (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve();
          }
        );
      }
    );
  });
}

module.exports = {
  getAllTasksApi,
  getTaskDetailApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  updateOrderAndStatus,
  createTaskCommentApi,
};
