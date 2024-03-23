const router = require("express").Router();
const controller = require("../controller/test.controller");
router.get("/slk", controller.testController);
router.get("", (req, res) => {
  res.send("<h1>its working</h1>");
});
module.exports = router;
