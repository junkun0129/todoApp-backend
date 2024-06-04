const router = require("express").Router();
const controller = require("../controller/task.controller");
router.get("/list", controller.getAllTasksApi);
router.post("/detail", controller.getTaskDetailApi);
router.post("/create", controller.createTaskApi);
router.post("/update", controller.updateTaskApi);
router.post("/delete", controller.deleteTaskApi);
router.post("/orderstatusupdate", controller.updateOrderAndStatus);
router.post("/createcomment", controller.createTaskCommentApi);

module.exports = router;
