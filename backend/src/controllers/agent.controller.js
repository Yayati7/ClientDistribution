const Agent = require("../models/agent.model");
const bcrypt = require("bcryptjs");
const distributeTasks = require("../utils/distribute");
const Task = require("../models/task.model");

exports.createAgent = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const agent = await Agent.create({
            name,
            email,
            phone,
            password: hash
        });

        console.log("New agent created:", agent.name);

        // Redistribute all existing tasks after new agent added
        const agents = await Agent.find();
        const allTasks = await Task.find();
        
        if (allTasks.length > 0) {
            console.log(`Redistributing ${allTasks.length} tasks among ${agents.length} agents`);
            
            // Delete all existing tasks
            await Task.deleteMany({});
            
            // Redistribute and reinsert
            const tasksData = allTasks.map(t => ({
                firstName: t.firstName,
                phone: t.phone,
                notes: t.notes
            }));
            
            const distributedTasks = distributeTasks(tasksData, agents);
            await Task.insertMany(distributedTasks);
        }

        res.json(agent);
    } catch (error) {
        console.error("Error creating agent:", error);
        res.status(500).json({ message: "Error creating agent" });
    }
};

exports.getAgents = async (req, res) => {
    try {
        const agents = await Agent.find();
        res.json(agents);
    } catch (error) {
        console.error("Error fetching agents:", error);
        res.status(500).json({ message: "Error fetching agents" });
    }
};

exports.getStats = async (req, res) => {
    try {
        const totalAgents = await Agent.countDocuments();
        const totalTasks = await Task.countDocuments();

        const tasksPerAgent = await Task.aggregate([
            {
                $group: {
                    _id: "$agent",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "agents",
                    localField: "_id",
                    foreignField: "_id",
                    as: "agent"
                }
            },
            { $unwind: "$agent" },
            {
                $project: {
                    _id: 0,
                    name: "$agent.name",
                    count: 1
                }
            }
        ]);

        res.json({
            totalAgents,
            totalTasks,
            tasksPerAgent
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};