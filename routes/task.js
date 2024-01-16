const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.route('/')
    .get( taskController.getTasks)
    .post( taskController.createTask);

router.route('/:id')
    .get( taskController.getTask)
    .put( taskController.updateTask)
    .delete( taskController.deleteTask);

router.route('/lawyer/:lawyerId')
    .get( taskController.getTasksForLawyer);

module.exports = router;