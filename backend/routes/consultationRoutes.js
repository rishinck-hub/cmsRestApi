const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and doctor role
router.use(auth);
router.use(authorize('doctor', 'admin'));

// Consultation Notes Routes
router.post('/', consultationController.addConsultationNote);
router.put('/:consultationId', consultationController.updateConsultationNote);
router.get('/appointment/:appointmentId', consultationController.getConsultationByAppointmentId);
router.get('/doctor/:doctorId', consultationController.listConsultationsByDoctor);

// Consultation History Routes
router.get('/patient/:patientId', consultationController.listConsultationHistoryByPatient);
router.get('/doctor/:doctorId/history', consultationController.listConsultationHistoryByDoctor);
router.get('/history/appointment/:appointmentId', consultationController.getConsultationHistoryByAppointmentId);

module.exports = router; 