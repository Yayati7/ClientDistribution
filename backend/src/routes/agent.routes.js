const router = require("express").Router();
const { createAgent, getAgents, getStats } = require("../controllers/agent.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, createAgent);
router.get("/", auth, getAgents);
router.get("/stats", auth, getStats);

module.exports = router;
