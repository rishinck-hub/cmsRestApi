const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResultController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// Lab Result Routes by Appointment/Patient (must come before /:labResultId)
router.get('/appointment/:appointmentId', authorize('doctor', 'admin', 'labtech'), labResultController.getLabResultsByAppointmentId);
router.get('/patient/:patientId', authorize('doctor', 'admin', 'labtech'), labResultController.getLabResultsByPatientId);

// Lab Technician Specific Routes (must come before /:labResultId)
router.put('/record/:labResultId', authorize('labtech', 'admin'), labResultController.recordLabTestResult);
router.get('/date-range', authorize('labtech', 'admin'), labResultController.getLabResultsByDateRange);

// Lab Result Management Routes (Doctor & Admin)
router.post('/', authorize('doctor', 'admin'), labResultController.createLabResult);
router.get('/', authorize('doctor', 'admin', 'labtech'), labResultController.listAllLabResults);
router.get('/:labResultId', authorize('doctor', 'admin', 'labtech'), labResultController.getLabResultById);
router.put('/:labResultId', authorize('doctor', 'admin'), labResultController.updateLabResult);
router.patch('/:labResultId/deactivate', authorize('labtech', 'admin'), labResultController.deactivateLabResult);

module.exports = router;
