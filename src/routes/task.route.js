const router = require("express").Router();
const controller = require("../controller/task.controller");
const { auth } = require("../../auth");
router.get("/list", auth, controller.getAllTasks);
router.post("/create", auth, controller.createTask);
router.post("/delete", auth, controller.deleteTask);
module.exports = router;
