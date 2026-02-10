const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const { uploadCSV, getDistributedTasks } = require("../controllers/upload.controller");

const upload = multer({ dest: "uploads/" });

router.post("/", auth, upload.single("file"), uploadCSV);
router.get("/tasks", auth, getDistributedTasks);


module.exports = router;
