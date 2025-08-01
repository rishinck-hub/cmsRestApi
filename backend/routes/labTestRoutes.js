const express = require('express');
const router = express.Router();
const labTestController = require('../controllers/labTestController');
const labResultController = require('../controllers/labResultController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// Lab Test Prescription Routes (Doctor & Admin)
router.post('/', authorize('doctor', 'admin'), labTestController.createLabTestPrescription);
router.put('/:prescriptionId', authorize('doctor', 'admin'), labTestController.updateLabTestPrescription);
router.get('/:prescriptionId', authorize('doctor', 'admin', 'labtech'), labTestController.getLabTestPrescriptionById);
router.get('/', authorize('doctor', 'admin', 'labtech'), labTestController.listLabTestPrescriptionsByDoctor);
router.patch('/:prescriptionId/deactivate', authorize('doctor', 'admin'), labTestController.deactivateLabTestPrescription);

// Lab Test Prescription Routes by Appointment/Patient
router.get('/appointment/:appointmentId', authorize('doctor', 'admin', 'labtech'), labTestController.getLabTestPrescriptionByAppointmentId);
router.get('/patient/:patientId', authorize('doctor', 'admin', 'labtech'), labTestController.listLabTestPrescriptionsByPatient);

// Lab Result Routes (Doctor & Admin)
router.post('/labresult', authorize('doctor', 'admin'), labResultController.createLabResult);
router.put('/labresult/:labResultId', authorize('doctor', 'admin'), labResultController.updateLabResult);
router.get('/labresult/:labResultId', authorize('doctor', 'admin', 'labtech'), labResultController.getLabResultById);
router.get('/labresult', authorize('doctor', 'admin', 'labtech'), labResultController.listAllLabResults);

// Lab Result Routes by Appointment/Patient
router.get('/labresult/appointment/:appointmentId', authorize('doctor', 'admin', 'labtech'), labResultController.getLabResultsByAppointmentId);
router.get('/labresult/patient/:patientId', authorize('doctor', 'admin', 'labtech'), labResultController.getLabResultsByPatientId);

// Lab Technician Specific Routes
router.put('/results/:labResultId', authorize('labtech', 'admin'), labResultController.recordLabTestResult);
router.get('/results/appointment/:appointmentId', authorize('labtech', 'admin', 'doctor'), labResultController.getLabResultsByAppointmentId);
router.get('/results', authorize('labtech', 'admin'), labResultController.getLabResultsByDateRange);
router.patch('/labresult/:labResultId/deactivate', authorize('labtech', 'admin'), labResultController.deactivateLabResult);

module.exports = router; 