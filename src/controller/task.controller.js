const { connection } = require("../db/mysql");

const getAllTaskGroups = (req, res) => {
  const sql = `
  SELECT
    tg.taskgroup_id,
    tg.name,
    tg.order_num,
    CASE
      WHEN COUNT(t.task_id) = 0 THEN JSON_ARRAY()
      ELSE JSON_ARRAYAGG(JSON_OBJECT(
        'task_id', t.task_id,
        'user_id', t.user_id,
        'user_name', CONCAT(u.first_name, ' ', u.last_name),
        'user_img', u.img,
        'title', t.title,
        'description', t.description,
        'status', t.status,
        'created_at', t.created_at
      ))
    END AS tasks
  FROM
    TASKGROUP tg
  LEFT JOIN
    TASKS t ON tg.taskgroup_id = t.taskgroup_id
  LEFT JOIN
    USERS u ON t.user_id = u.user_id
  GROUP BY
    tg.taskgroup_id;
`;
  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    const formattedResults = rows.map((row) => ({
      taskgroup_id: row.taskgroup_id,
      name: row.name,
      order_num: row.order_num,
      tasks: JSON.parse(row.tasks),
    }));
    return res.status(200).json({ result: "success", data: formattedResults });
  });
};

const createTaskGroup = (req, res) => {
  const sql = "select * from TASKGROUP";
  connection.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    const { name } = req.body;
    let order;
    if (!rows.length || !rows) {
      order = 1;
    } else {
      order = rows.length + 1;
    }
    const sql = "insert into TASKGROUP (name, order_num) values (?, ?)";
    const values = [name, order];
    connection.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "", result: "failed" });
      }
      return res.status(200).json({ result: "success" });
    });
  });
};

const createTask = (req, res) => {
  const { user_id, taskgroup_id, title, description } = req.body;
  console.log(req.body, "req body");
  const sql =
    "insert into TASKS (user_id, taskgroup_id, title, description, status) values (?, ?, ?, ?, ?)";
  const values = [user_id, taskgroup_id, title, description, "new"];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    return res.status(200).json({ result: "success" });
  });
};

const updateTask = (req, res) => {
  const { task_id, status, title, description } = req.body;
  const sql =
    "update TASKS set title = ?, description = ?, status = ? where task_id = ?";
  const values = [title, description, status, task_id];
  connection.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    return res.status(200).json({ result: "success" });
  });
};

const getTaskDetail = (req, res) => {
  console.log(req.body, ";;;;;;;;;;;;;;;");
  const { id } = req.body;
  const sql = "select * from TASKS where task_id = ?";
  const values = [id];
  connection.query(sql, values, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "", result: "failed" });
    }
    if (rows) {
      return res.status(200).json({ result: "success", data: rows[0] });
    }
  });
};

const deleteTask = (req, res) => {
  const { id } = req.body;
  const sql = `DELETE FROM TASKS WHERE task_id = ?`;
  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "データの削除中にエラーが発生しました。",
        result: "failed",
      });
    }
    return res.status(200).json({ result: "success" });
  });
};

const deleteTaskGroup = (req, res) => {
  const { id } = req.body;
  const sql = `DELETE FROM TASKGROUP WHERE taskgroup_id = ?`;
  const values = [id];
  connection.query(sql, values, (err, result) => {
    console.log(err, "resultttt");
    if (!err) {
      return res
        .status(200)
        .json({ result: "success", message: "成功しました" });
    }
    if (err.errno === 1451) {
      return res.status(200).json({
        message: "タスクが紐づいているため削除できません",
        result: "failed",
      });
    }
    if (err) {
      return res.status(500).json({
        message: "データの削除中にエラーが発生しました。",
        result: "failed",
      });
    }
  });
};

module.exports = {
  getAllTaskGroups,
  createTaskGroup,
  createTask,
  deleteTask,
  deleteTaskGroup,
  updateTask,
  getTaskDetail,
};
