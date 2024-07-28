const router = require("express").Router();
const { auth } = require("../../auth");
const controller = require("../controller/task.controller");
router.get("/list", auth, controller.getAllTasksApi);
router.post("/detail", auth, controller.getTaskDetailApi);
router.post("/create", auth, controller.createTaskApi);
router.post("/update", auth, controller.updateTaskApi);
router.post("/delete", auth, controller.deleteTaskApi);
router.post("/orderstatusupdate", auth, controller.updateOrderAndStatus);
router.post("/createcomment", auth, controller.createTaskCommentApi);

module.exports = router;
