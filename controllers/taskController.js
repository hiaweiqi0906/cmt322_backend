const mongoose = require('mongoose');
const Task = require('./models/Task'); // Import the Task model

const checkTaskAccess = async (userId, type, taskId) => {
    let tasks;
    if (type === "admin")
        tasks = await Task.findById(new mongoose.Types.ObjectId(taskId))
    else
        tasks = await Task.find(
            {
                "task_member_list.task_member_id": userId,
                "task_member_list.task_member_type": type,
                "_id": new mongoose.Types.ObjectId(taskId)
            }
        )

    if (!tasks || tasks.length === 0)
        throw new DataNotExistError("Task not exist")
}

// 创建任务
const createTask = async (req, res) => {
    const { id, creator, title, lawyer, description, status, assignedBy, assignedTo, deadline, taskAssignedDate, acceptanceCriteria } = req.body;

    const task = new Task({
        _id: new mongoose.Types.ObjectId(id),
        creator,
        title,
        lawyer,
        description,
        status,
        assignedBy: assignedBy || creator, // 如果没有指定 assignedBy，则默认为 creator
        assignedTo: assignedTo || lawyer, // 如果没有指定 assignedTo，则默认为 lawyer
        deadline,
        taskAssignedDate: taskAssignedDate || Date.now(), // 如果没有指定 taskAssignedDate，则默认为当前日期
        acceptanceCriteria
    });

    try {
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 获取所有任务
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取某个律师的所有任务
const getTasksForLawyer = async (req, res) => {
    const lawyerId = req.params.lawyerId; // 从 URL 中获取律师 ID
    try {
        const tasks = await Task.find({ assignedTo: lawyerId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 获取单个任务
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // 检查当前用户是否有权限查看该任务
        const currentUser = req.user; // 从 req.user 中获取当前用户
        if (String(task.assignedTo) !== String(currentUser._id)) {
            return res.status(403).json({ error: 'You do not have permission to view this task' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 更新任务
const updateTask = async (req, res) => {
    const { id, creator, title, lawyer, description, status, assignedBy, assignedTo, deadline, taskAssignedDate, acceptanceCriteria } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { creator, title, lawyer, description, status, assignedBy, assignedTo, deadline, taskAssignedDate, acceptanceCriteria }, { new: true }); 
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 删除任务
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };