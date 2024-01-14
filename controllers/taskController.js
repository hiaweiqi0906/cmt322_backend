const mongoose = require('mongoose');
const Task = require('../models/task'); // Import the Task model

// 创建任务
const createTask = async (req, res) => {
    try {
        const { title, description, status, assignedBy, assignedTo, deadline, acceptanceCriteria } = req.body;

        const task = new Task({
            title,
            description,
            status,
            assignedBy,
            assignedTo,
            deadline,
            taskAssignedDate: Date.now(),
            acceptanceCriteria
        });
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createTask, getTasks, getTask, updateTask, deleteTask, getTasksForLawyer };