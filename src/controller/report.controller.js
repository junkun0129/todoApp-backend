const { connection } = require("../db/mysql");
const { tables } = require("../../config").querys;
const {
  generateRandomString,
  getUserId,
  transaction,
} = require("../utils/common.util");
const {
  beginTransaction,
  rollbackTransaction,
} = require("../utils/common.util");
const jwt = require("jsonwebtoken");

const createReportApi = async (req, res) => {
  const { date, dailyTasks } = req.body;

  transaction(connection, res, async () => {
    const rows = await doubleCheckReport(date);
    console.log(rows, "rowssssssssssssss");
    if (rows.length) {
    } else {
      const report_id = generateRandomString(35);
      const user_id = getUserId(req);

      await createReport(date, user_id, report_id);
      await createDailyTasks(dailyTasks, report_id);
    }
  });
};

function doubleCheckReport(date) {
  return new Promise((resolve, reject) => {
    const sql = `select * from ${tables.reports} where date = ?`;
    const values = [date];
    connection.query(sql, values, (error, rows) => {
      if (error) {
        return reject(error);
      }
      resolve(rows);
    });
  });
}

function createReport(date, user_id, report_id) {
  return new Promise((resolve, reject) => {
    const sql = `insert into ${tables.reports} (report_id, user_id, date) values (?, ?, ?)`;
    const values = [report_id, user_id, date];
    connection.query(sql, values, (error, results) => {
      if (error) {
        return reject();
      }
      resolve();
    });
  });
}
function createDailyTasks(dailyTasks, report_id) {
  return new Promise((resolve, reject) => {
    const sql = `insert into ${tables.dailyTasks} (dailytask_id, report_id, task_id, result, improve ) values ?`;
    let values = [];
    dailyTasks.map((dailyTask, i) => {
      const dailytask_id = generateRandomString(35);
      const value = [
        dailytask_id,
        report_id,
        dailyTask.task_id,
        dailyTask.result,
        dailyTask.improve,
      ];
      values.push(value);
    });
    connection.query(sql, [values], (error, results) => {
      if (error) {
        return reject();
      }
      resolve(results);
    });
  });
}

const getReportsApi = (req, res) => {
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
  createReportApi,
  getReportsApi,
};
