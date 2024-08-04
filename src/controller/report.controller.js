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
      const report_id = generateRandomString(35);
      const user_id = getUserId(req);

      await createReport(report, user_id, report_id);
      await createDailyTasks(dailyTasks, report_id);
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
    connection.query(sql, [values], (error, results) => {
      if (error) {
        return reject();
      }
      resolve(results);
    });
  });
}

const getReportApi = (req, res) => {
  console.log("lskdj");
  transaction(connection, res, async () => {
    const report = await getReports(req, req.query);
    return res.status(200).json({
      data: report,
      result: "success",
    });
  });
};

const getReportsApi = (req, res) => {
  transaction(connection, res, async () => {
    const reports = await getReports(req);
    if (!reports.length) {
      return res.status(200).json({
        message: "レポートがありません",
        result: "success",
      });
    } else {
      let dataPromises = reports.map(async (report, i) => {
        const dailytasks = await getDailyTasks(report.report_id);
        const child = { report, dailytasks };
        return child;
      });
      const data = await Promise.all(dataPromises);

      let grouped = {};
      data.forEach((item) => {
        if (!grouped[item.report.date]) {
          grouped[item.report.date] = {
            date: item.report.date,
            plan: null,
            result: null,
          };
        }

        if (item.report.category === "plan") {
          grouped[item.report.date].plan = item;
        }
        if (item.report.category === "result") {
          grouped[item.report.date].result = item;
        }
      });
      const pairedReports = Object.values(grouped);

      return res.status(200).json({
        result: "success",
        data: pairedReports,
      });
    }
  });
};

function getReports(req, query = null) {
  return new Promise((resolve, reject) => {
    const user_id = getUserId(req);
    let sql = `select * from ${tables.reports} where user_id = ?`;
    if (query) {
      const { date, category } = query;
      if (date) {
        sql += ` and date = '${date}'`;
      }

      if (category) {
        sql += ` and category = '${category}'`;
      }
    }
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
    connection.query(sql, values, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  createReportApi,
  getReportsApi,
  getReportApi,
};
