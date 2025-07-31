const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// Appointment Management Routes (Receptionist & Admin)
router.post('/', authorize('receptionist', 'admin'), appointmentController.scheduleAppointment);
router.put('/:appointmentId', authorize('receptionist', 'admin'), appointmentController.updateAppointment);
router.get('/:appointmentId', authorize('receptionist', 'admin', 'doctor'), appointmentController.getAppointmentById);
router.get('/', authorize('receptionist', 'admin', 'doctor'), appointmentController.listAppointmentsByDate);
router.patch('/:appointmentId/cancel', authorize('receptionist', 'admin'), appointmentController.cancelAppointment);

// Appointment Listing Routes
router.get('/patient/:patientId', authorize('receptionist', 'admin', 'doctor'), appointmentController.listAppointmentsByPatient);
router.get('/doctor/:doctorId', authorize('receptionist', 'admin', 'doctor'), appointmentController.listAppointmentsByDoctor);

module.exports = router; 