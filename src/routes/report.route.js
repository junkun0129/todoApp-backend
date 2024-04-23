const router = require("express").Router();
const { auth } = require("../../auth");
const controller = require("../controller/report.controller");

router.post("/create", auth, controller.createReport);
router.post("/list", auth, controller.getReports);

module.exports = router;
