const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController')

router.get('/admin/:username', appointmentController.adminGetAppointment)

router.get('/userlist/:username', appointmentController.getUserList)


module.exports = router;