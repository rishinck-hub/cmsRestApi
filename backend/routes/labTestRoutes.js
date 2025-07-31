const express = require('express');
const router = express.Router();
const labTestController = require('../controllers/labTestController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// Lab Test Management Routes (Lab Technician & Admin)
router.post('/', authorize('labtech', 'admin'), labTestController.addLabTest);
router.put('/:labTestId', authorize('labtech', 'admin'), labTestController.updateLabTest);
router.get('/:labTestId', authorize('labtech', 'admin', 'doctor'), labTestController.getLabTestById);
router.get('/', authorize('labtech', 'admin', 'doctor'), labTestController.listAllLabTests);
router.patch('/:labTestId/deactivate', authorize('labtech', 'admin'), labTestController.deactivateLabTest);

// Lab Test Prescription Routes (Doctor & Admin)
router.post('/prescription', authorize('doctor', 'admin'), labTestController.createLabTestPrescription);
router.put('/prescription/:prescriptionId', authorize('doctor', 'admin'), labTestController.updateLabTestPrescription);
router.get('/prescription/appointment/:appointmentId', authorize('doctor', 'admin', 'labtech'), labTestController.getLabTestPrescriptionByAppointmentId);
router.get('/prescription/patient/:patientId', authorize('doctor', 'admin', 'labtech'), labTestController.listLabTestPrescriptionsByPatient);

// Lab Test Results Routes (Lab Technician & Admin)
router.put('/results/:labTestPrescriptionId', authorize('labtech', 'admin'), labTestController.recordLabTestResult);
router.get('/results/appointment/:appointmentId', authorize('labtech', 'admin', 'doctor'), labTestController.getLabTestResultByAppointmentId);
router.get('/results', authorize('labtech', 'admin'), labTestController.listLabTestResultsByDateRange);
router.patch('/:labTestPrescriptionId/deactivate', authorize('labtech', 'admin'), labTestController.deactivateLabTestPrescription);

module.exports = router; 