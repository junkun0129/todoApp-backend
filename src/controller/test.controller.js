const db = require("../db/mysql");

const testController = (req, res) => {
  db.query("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.log("Error fetching data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Data fetched successfully:", rows);
    return res.json(rows);
  });
};

module.exports = {
  testController,
};
