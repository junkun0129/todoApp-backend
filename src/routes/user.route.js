const router = require("express").Router();
const multer = require("multer");
const { auth } = require("../../auth");
const controller = require("../controller/user.controller");
const upload = multer({ dest: "../user_folders" });

router.post("/edit", auth, controller.editUserProfile);
router.post("/get", auth, controller.getUserProfile);
router.post(
  "/updimg",
  (req, res, next) => {
    console.log(req.file, "filename");
  },
  controller.updateImage
);
module.exports = router;
