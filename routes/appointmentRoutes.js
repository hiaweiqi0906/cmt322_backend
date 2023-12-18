const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController')

router.get('/admin/:username', appointmentController.adminGetAppointment)


module.exports = router;