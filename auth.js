const jwt = require("jsonwebtoken");
const config = require("./config");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    console.log("nextいけたよ");
    next();
  } catch (err) {
    console.log("いけなかったよおおよよおお");
    res.status(401).json({
      message: "認証できません",
    });
  }
};

module.exports = {
  auth,
};
