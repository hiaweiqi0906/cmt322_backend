const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// To get the appointments for displaying in website
router.get('/', appointmentController.getAppointments);

// To create a new appointment nad store in database
router.post('/', appointmentController.createAppointment);

// To check the user's role
router.get('/isAdmin', appointmentController.checkUserRole);

// To get other user's name list for options
router.get('/userlist', appointmentController.getUserList);

// To get a particular appointment based on the id
router.get('/:id', appointmentController.getSpecificAppointment);

// To update a particular appointment based on the id
router.put('/:id', appointmentController.updateAppointment);

// To cancel the appointment based on the id
router.delete('/:id', appointmentController.cancelAppointment);

// To update the user response to the appointment
router.put('/response/:id', appointmentController.updateUserResponse);




module.exports = router;