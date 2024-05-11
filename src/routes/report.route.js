const router = require("express").Router();
const { auth } = require("../../auth");
const controller = require("../controller/report.controller");

router.post("/create", auth, controller.createReportApi);
router.get("/list", auth, controller.getReportsApi);

module.exports = router;
