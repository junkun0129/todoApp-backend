const router = require("express").Router();
const controller = require("../controller/test.controller");
router.get("/list", controller.testController);
module.exports = router;
