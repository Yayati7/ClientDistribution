require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const agentRoutes = require("./routes/agent.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Uploads directory created at:", uploadsDir);
}

// CORS configuration - MUST be before routes
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://clientdistribution-frontend.onrender.com'],
    credentials: true
}));

// Body parser - MUST be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log("Headers:", req.headers);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/upload", uploadRoutes);

// Test route to verify server is working
app.get("/api/test", (req, res) => {
    console.log("Test route hit");
    res.json({ message: "Server is working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("ERROR:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ 
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Uploads directory: ${uploadsDir}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });