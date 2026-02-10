const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth.middleware");
const { uploadCSV, getDistributedTasks } = require("../controllers/upload.controller");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log("Upload routes - uploads directory:", uploadsDir);

// Configure multer with detailed logging
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("=== MULTER DESTINATION ===");
        console.log("Saving to:", uploadsDir);
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + "-" + file.originalname;
        console.log("=== MULTER FILENAME ===");
        console.log("Generated filename:", filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log("=== MULTER FILE FILTER ===");
        console.log("File:", file.originalname);
        console.log("Mimetype:", file.mimetype);
        
        if (file.mimetype === 'text/csv' || 
            file.mimetype === 'application/vnd.ms-excel' ||
            file.originalname.endsWith('.csv')) {
            console.log("File accepted");
            cb(null, true);
        } else {
            console.log("File rejected - not CSV");
            cb(new Error('Only CSV files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Test route
router.get("/test", (req, res) => {
    console.log("Upload test route hit");
    res.json({ message: "Upload routes working" });
});

// TEMPORARY - Remove auth for testing
router.post("/", (req, res, next) => {
    console.log("\n========== UPLOAD POST REQUEST RECEIVED ==========");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
}, upload.single("file"), (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ message: err.message });
    }
    next();
}, uploadCSV);
// Get tasks route
router.get("/tasks", auth, getDistributedTasks);

module.exports = router;
