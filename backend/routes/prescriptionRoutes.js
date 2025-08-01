const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const labTestController = require('../controllers/labTestController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and doctor role
router.use(auth);
router.use(authorize('doctor', 'admin'));

// Medicine Prescription Routes
router.post('/medicine', prescriptionController.createMedicinePrescription);
router.put('/medicine/:prescriptionId', prescriptionController.updateMedicinePrescription);
router.patch('/medicine/:prescriptionId/deactivate', prescriptionController.deactivatePrescription);
router.get('/medicine/appointment/:appointmentId', prescriptionController.getPrescriptionsByAppointmentId);
router.get('/medicine/patient/:patientId', prescriptionController.listPrescriptionsByPatient);
router.get('/medicine/doctor/:doctorId', prescriptionController.listPrescriptionsByDoctor);
router.get('/medicine/:prescriptionId', prescriptionController.getPrescriptionById);

// Lab Test Prescription Routes
router.post('/labtest', labTestController.createLabTestPrescription);
router.put('/labtest/:prescriptionId', labTestController.updateLabTestPrescription);
router.patch('/labtest/:prescriptionId/deactivate', labTestController.deactivateLabTestPrescription);
router.get('/labtest/appointment/:appointmentId', labTestController.getLabTestPrescriptionByAppointmentId);
router.get('/labtest/patient/:patientId', labTestController.listLabTestPrescriptionsByPatient);
router.get('/labtest/doctor/:doctorId', labTestController.listLabTestPrescriptionsByDoctor);
router.get('/labtest/:prescriptionId', labTestController.getLabTestPrescriptionById);

module.exports = router; 