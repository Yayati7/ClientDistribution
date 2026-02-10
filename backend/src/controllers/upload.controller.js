const Task = require("../models/task.model");
const Agent = require("../models/agent.model");
const distributeTasks = require("../utils/distribute");
const csv = require("csv-parser");
const fs = require("fs");

exports.uploadCSV = async (req, res) => {
    let tasks = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
            tasks.push({
                firstName: row.FirstName,
                phone: row.Phone,
                notes: row.Notes
            });
        })
        .on("end", async () => {
            const agents = await Agent.find();

            const distributed = distributeTasks(tasks, agents);

            await Task.insertMany(distributed);

            res.json({ message: "Uploaded and distributed successfully" });
        });
};


exports.getDistributedTasks = async (req, res) => {
    const tasks = await Task.find().populate("agent");
    res.json(tasks);
};