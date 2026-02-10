const Task = require("../models/task.model");
const Agent = require("../models/agent.model");
const distributeTasks = require("../utils/distribute");
const csv = require("csv-parser");
const fs = require("fs");

exports.uploadCSV = async (req, res) => {
    console.log("\n========== CSV UPLOAD STARTED ==========");
    console.log("Request received at:", new Date().toISOString());
    
    // Check if file exists
    if (!req.file) {
        console.log("ERROR: No file in request");
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:");
    console.log("  - Original name:", req.file.originalname);
    console.log("  - Saved as:", req.file.filename);
    console.log("  - Path:", req.file.path);
    console.log("  - Size:", req.file.size, "bytes");
    console.log("  - Mimetype:", req.file.mimetype);

    // Check if file actually exists on disk
    if (!fs.existsSync(req.file.path)) {
        console.log("ERROR: File does not exist at path:", req.file.path);
        return res.status(500).json({ message: "File was not saved properly" });
    }

    // Read file size to verify it's not empty
    const stats = fs.statSync(req.file.path);
    console.log("File size on disk:", stats.size, "bytes");
    
    if (stats.size === 0) {
        console.log("ERROR: File is empty");
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Uploaded file is empty" });
    }

    const tasks = [];
    let rowCount = 0;

    const stream = fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("headers", (headers) => {
            console.log("CSV Headers detected:", headers);
        })
        .on("data", (row) => {
            rowCount++;
            console.log(`Row ${rowCount}:`, row);
            
            tasks.push({
                firstName: row.FirstName || row.firstname || row.FIRSTNAME,
                phone: row.Phone || row.phone || row.PHONE,
                notes: row.Notes || row.notes || row.NOTES
            });
        })
        .on("end", async () => {
            console.log(`\nCSV parsing complete. Rows read: ${rowCount}`);
            console.log(`Tasks collected: ${tasks.length}`);
            
            try {
                if (tasks.length === 0) {
                    console.log("WARNING: No tasks found in CSV");
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({ message: "No valid tasks found in CSV" });
                }

                console.log("\nTasks to be inserted:");
                tasks.forEach((task, i) => {
                    console.log(`  ${i + 1}. ${task.firstName} - ${task.phone} - ${task.notes}`);
                });

                // Get all agents
                const agents = await Agent.find();
                console.log(`\nAgents found: ${agents.length}`);
                
                if (agents.length === 0) {
                    console.log("WARNING: No agents available for distribution");
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({ 
                        message: "No agents available. Please create agents first." 
                    });
                }

                agents.forEach((agent, i) => {
                    console.log(`  ${i + 1}. ${agent.name} (${agent.email})`);
                });

                // Distribute tasks among agents
                console.log("\nDistributing tasks...");
                const distributedTasks = distributeTasks(tasks, agents);
                
                console.log("\nDistributed tasks:");
                distributedTasks.forEach((task, i) => {
                    const agentName = agents.find(a => a._id.equals(task.agent))?.name;
                    console.log(`  ${i + 1}. ${task.firstName} -> Agent: ${agentName}`);
                });

                // Insert all tasks into database
                console.log("\nInserting into database...");
                const savedTasks = await Task.insertMany(distributedTasks);
                console.log(`SUCCESS: ${savedTasks.length} tasks saved to database`);

                // Delete the uploaded file after processing
                fs.unlinkSync(req.file.path);
                console.log("Uploaded file deleted");

                console.log("========== CSV UPLOAD COMPLETED ==========\n");

                res.json({ 
                    success: true,
                    message: "CSV uploaded and distributed successfully",
                    tasksAdded: savedTasks.length,
                    agentsCount: agents.length
                });

            } catch (error) {
                console.error("\nERROR during processing:", error);
                console.error("Stack trace:", error.stack);
                
                // Clean up file on error
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                
                res.status(500).json({ 
                    message: "Error processing CSV", 
                    error: error.message 
                });
            }
        })
        .on("error", (error) => {
            console.error("\nCSV PARSING ERROR:", error);
            console.error("Stack trace:", error.stack);
            
            // Clean up file on error
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({ 
                message: "Error parsing CSV", 
                error: error.message 
            });
        });
};

exports.getDistributedTasks = async (req, res) => {
    try {
        console.log("\n========== FETCHING TASKS ==========");
        const tasks = await Task.find().populate("agent");
        console.log(`Fetched ${tasks.length} tasks from database`);
        
        tasks.forEach((task, i) => {
            console.log(`  ${i + 1}. ${task.firstName} - ${task.phone} - Agent: ${task.agent?.name || 'N/A'}`);
        });
        
        console.log("========== FETCH COMPLETE ==========\n");
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
};