const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// To get the appointments for displaying in website
router.get('/', appointmentController.getAppointments);

// To check the user's role
router.get('/isAdmin', appointmentController.checkUserRole);

// To get other user's name list for options
router.get('/userlist', appointmentController.getUserList);

router.post('/', appointmentController.storeNewAppointment);


module.exports = router;