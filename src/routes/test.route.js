const router = require("express").Router();
const controller = require("../controller/test.controller");
router.get("/slk", controller.testController);
module.exports = router;
