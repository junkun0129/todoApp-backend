const router = require("express").Router();
// const multer = require("multer");
const { auth } = require("../../auth");
const controller = require("../controller/user.controller");
// const upload = multer({ dest: "../user_folders" });

router.post("/edit", auth, controller.editUserProfile);
router.post("/get", auth, controller.getUserProfile);
router.post(
  "/updimg",
  (req, res, next) => {
    console.log(req.body);
    console.log(req.files, "filenames");
    console.log(req.file, "filename");
    if (!req.files) {
      console.log("no file data");
      return res
        .status(400)
        .json({ message: "ファイルが見つかりませんでした" });
    }
    return res.status(200).json({ message: "いえい" });
  },
  controller.updateImage
);
module.exports = router;
