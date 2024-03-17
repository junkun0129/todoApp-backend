const router = require("express").Router();
const controller = require("../controller/auth.contorller");

router.get("/signin", controller.signInController);
module.exports = router;
