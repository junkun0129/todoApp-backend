const jwt = require("jsonwebtoken");
const config = require("./config");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log(token);
    next();
  } catch (err) {
    res.status(401).json({
      message: "認証できません",
    });
  }
};

module.exports = {
  auth,
};
