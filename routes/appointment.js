const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController')

<<<<<<< HEAD:routes/appointment.js
router.get('/', appointmentController.adminGetAppointment)
=======
router.get('/admin/:username', appointmentController.adminGetAppointment)

router.get('/userlist/:username', appointmentController.getUserList)

>>>>>>> b408519 (updating the existing code):routes/appointmentRoutes.js

module.exports = router;