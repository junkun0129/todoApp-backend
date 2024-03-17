const mysql = require("mysql");

const db = mysql.createConnection({
  host: "database-2.c3k4oka820lq.ap-northeast-1.rds.amazonaws.com",
  user: "admin",
  password: "omX6RN5xylBuQFekxvsA",
  database: "my_database",
});

db.connect((err) => {
  if (err) {
    console.log("failed to connect to database");
  }

  console.log("successfully connected to database");
});
module.exports = db;
