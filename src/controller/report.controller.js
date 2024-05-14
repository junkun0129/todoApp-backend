const { connection } = require("../db/mysql");
const { tables } = require("../../config").querys;
const {
  generateRandomString,
  getUserId,
  transaction,
} = require("../utils/common.util");
const jwt = require("jsonwebtoken");

const createReportApi = async (req, res) => {
  const { date, dailyTasks } = req.body;

  transaction(connection, res, async () => {
    const rows = await doubleCheckReport(date);
    if (rows.length) {
      return res.status(200).json({
        message: "選択された日付では同じレポートがすでに提出されています",
        result: "success",
      });
    } else {
      const report_id = generateRandomString(35);
      const user_id = getUserId(req);

      await createReport(date, user_id, report_id);
      await createDailyTasks(dailyTasks, report_id);
      return res
        .status(200)
        .json({ message: "成功しました", result: "success" });
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
    const sql = `insert into ${tables.dailyTasks} (dailytask_id, report_id, task_id, result, improve, starttime, endtime ) values ?`;
    let values = [];
    dailyTasks.map((dailyTask, i) => {
      const dailytask_id = dailyTask.task_id
        ? generateRandomString(35)
        : "memo";

      const value = [
        dailytask_id,
        report_id,
        dailyTask.task_id,
        dailyTask.result,
        dailyTask.improve,
        dailyTask.starttime,
        dailyTask.endtime,
      ];
      values.push(value);
    });
    connection.query(sql, [values], (error, results) => {
      console.log(results, "results");
      console.log(error, "error");
      if (error) {
        return reject();
      }
      resolve(results);
    });
  });
}

const getReportsApi = (req, res) => {
  const { user } = req.query;

  let sql = `select * from ${tables.reports} where 1=1`;
  transaction(connection, res, async () => {
    const reports = await getReports(user);
    console.log("reports", reports);
    if (!reports.length) {
      return res.status(200).json({
        message: "レポートがありません",
        result: "success",
      });
    } else {
      let dataPromises = reports.map(async (report, i) => {
        const dailytasks = await getDailyTasks(report.report_id);
        const child = { report: { date: report.date }, dailytasks };
        console.log(child, "child");
        return child;
      });
      const data = await Promise.all(dataPromises);

      console.log(data, "data");
      return res.status(200).json({
        result: "success",
        data,
      });
    }
  });
};

function getReports(user_id) {
  return new Promise((resolve, reject) => {
    const sql = `select * from ${tables.reports} where user_id = ?`;
    const values = [user_id];
    connection.query(sql, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

function getDailyTasks(report_id) {
  return new Promise((resolve, reject) => {
    const sql = `select * from ${tables.dailyTasks} where report_id = ?`;
    const values = [report_id];
    console.log(report_id, "report_id");
    connection.query(sql, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      console.log(rows, "rows");
      resolve(rows);
    });
  });
}

module.exports = {
  createReportApi,
  getReportsApi,
};
