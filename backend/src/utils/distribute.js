const distributeTasks = (tasks, agents) => {
    console.log("\n--- distributeTasks function called ---");
    console.log("Tasks to distribute:", tasks.length);
    console.log("Available agents:", agents.length);
    
    if (!agents || agents.length === 0) {
        console.log("WARNING: No agents available");
        return tasks;
    }

    if (!tasks || tasks.length === 0) {
        console.log("WARNING: No tasks to distribute");
        return [];
    }

    // Assign agents to tasks in round-robin fashion
    const distributedTasks = tasks.map((task, index) => {
        const assignedAgent = agents[index % agents.length];
        console.log(`  Task ${index + 1}: ${task.firstName} -> Agent: ${assignedAgent.name}`);
        
        return {
            firstName: task.firstName,
            phone: task.phone,
            notes: task.notes,
            agent: assignedAgent._id
        };
    });

    console.log("--- Distribution complete ---\n");
    return distributedTasks;
};

module.exports = distributeTasks;