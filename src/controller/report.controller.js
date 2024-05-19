const { connection } = require("../db/mysql");
const { tables } = require("../../config").querys;
const {
  generateRandomString,
  getUserId,
  transaction,
} = require("../utils/common.util");
const jwt = require("jsonwebtoken");

const createReportApi = async (req, res) => {
  const { report, dailyTasks } = req.body;
  console.log(report, "report");
  transaction(connection, res, async () => {
    const rows = await doubleCheckReport(report);
    if (rows.length) {
      return res.status(200).json({
        message: "選択された日付では同じレポートがすでに提出されています",
        result: "success",
      });
    } else {
      console.log("past double check");
      const report_id = generateRandomString(35);
      const user_id = getUserId(req);

      await createReport(report, user_id, report_id);
      console.log("past create report");
      await createDailyTasks(dailyTasks, report_id);
      console.log("past create dailytasks");
      return res
        .status(200)
        .json({ message: "成功しました", result: "success" });
    }
  });
};

function doubleCheckReport(report) {
  return new Promise((resolve, reject) => {
    const { category, date } = report;
    const sql = `select * from ${tables.reports} where date = ? and category = ?`;
    const values = [date, category];
    connection.query(sql, values, (error, rows) => {
      if (error) {
        return reject(error);
      }
      resolve(rows);
    });
  });
}

function createReport(report, user_id, report_id) {
  return new Promise((resolve, reject) => {
    const { status, hours, category, date } = report;
    console.log("report inside createReport", report);
    const sql = `insert into ${tables.reports} (report_id, user_id, date, status, hours, category) values (?, ?, ?, ?, ?, ?)`;
    const values = [report_id, user_id, date, status, hours, category];
    connection.query(sql, values, (error, results) => {
      console.log(error);
      if (error) {
        return reject();
      }
      resolve();
    });
  });
}
function createDailyTasks(dailyTasks, report_id) {
  return new Promise((resolve, reject) => {
    const sql = `insert into ${tables.dailyTasks} (dailytask_id, report_id, task_id, result, improve, starttime, endtime, category ) values ?`;
    let values = [];
    dailyTasks.map((dailyTask, i) => {
      const dailytask_id = generateRandomString(35);

      let value = [
        dailytask_id,
        report_id,
        dailyTask.task_id,
        dailyTask.result,
        dailyTask.improve,
        dailyTask.starttime,
        dailyTask.endtime,
        dailyTask.task_id ? null : "memo",
      ];

      values.push(value);
    });
    console.log(values, "values");
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
