const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and doctor role
router.use(auth);
router.use(authorize('doctor', 'admin'));

// Medicine Prescription Routes
router.post('/medicine', prescriptionController.createMedicinePrescription);
router.put('/medicine/:prescriptionId', prescriptionController.updateMedicinePrescription);
router.get('/medicine/appointment/:appointmentId', prescriptionController.getPrescriptionByAppointmentId);
router.get('/medicine/patient/:patientId', prescriptionController.listPrescriptionsByPatient);

// Medicine Prescription History Routes
router.get('/medicine/history/patient/:patientId', prescriptionController.listMedicinePrescriptionHistoryByPatient);
router.get('/medicine/history/doctor/:doctorId', prescriptionController.listMedicinePrescriptionHistoryByDoctor);
router.get('/medicine/history/appointment/:appointmentId', prescriptionController.getMedicinePrescriptionHistoryByAppointmentId);

module.exports = router; 