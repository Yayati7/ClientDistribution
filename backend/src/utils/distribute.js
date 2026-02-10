const Task = require("../models/task.model");

const distributeTasks = async (agents) => {

    const tasks = await Task.find();

    if (!agents.length) return;

    for (let i = 0; i < tasks.length; i++) {
        tasks[i].agent = agents[i % agents.length]._id;
        await tasks[i].save();
    }
};

module.exports = distributeTasks;
