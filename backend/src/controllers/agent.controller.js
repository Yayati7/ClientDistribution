const Agent = require("../models/agent.model");
const bcrypt = require("bcryptjs");
const distributeTasks = require("../utils/distribute");
const Task = require("../models/task.model");


exports.createAgent = async (req, res) => {
    const { name, email, phone, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const agent = await Agent.create({
        name,
        email,
        phone,
        password: hash
    });

    // redistribute tasks after new agent added
    const agents = await Agent.find();
    await distributeTasks(agents);

    res.json(agent);
};


exports.getAgents = async (req, res) => {
    const agents = await Agent.find();
    res.json(agents);
};

exports.getStats = async (req, res) => {
    const totalAgents = await Agent.countDocuments();
    const totalTasks = await Task.countDocuments();

    const tasksPerAgent = await Task.aggregate([
    {
        $group:{
        _id:"$agent",
        count:{ $sum:1 }
        }
    },
    {
        $lookup:{
        from:"agents",
        localField:"_id",
        foreignField:"_id",
        as:"agent"
        }
    },
    { $unwind:"$agent" },
    {
        $project:{
        _id:0,
        name:"$agent.name",
        count:1
        }
    }
    ]);


    res.json({
        totalAgents,
        totalTasks,
        tasksPerAgent
    });
};