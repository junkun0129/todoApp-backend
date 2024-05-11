const router = require("express").Router();
const controller = require("../controller/task.controller");
router.get("/list", controller.getAllTasks);
router.post("/detail", controller.getTaskDetail);
router.post("/create", controller.createTask);
router.post("/update", controller.updateTask);
router.post("/delete", controller.deleteTask);
router.post("/orderstatusupdate", controller.updateOrderAndStatus);

module.exports = router;
