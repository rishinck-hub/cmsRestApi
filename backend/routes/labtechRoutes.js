// routes/labTechRoutes.js
const express = require('express');
const router = express.Router();
const labTechController = require('../controllers/labtechController');

// Lab Test Prescription Management
router.put('/labtests/results/:labTestPrescriptionId', labTechController.recordLabResult);
router.get('/labtests/results/appointment/:appointmentId', labTechController.getResultByAppointment);
router.get('/labtests/results', labTechController.listResultsByDateRange);
router.patch('/labtests/:labTestPrescriptionId/deactivate', labTechController.deactivateLabPrescription);

// Lab Test Management
router.post('/labtests', labTechController.addLabTest);
router.put('/labtests/:labTestId', labTechController.updateLabTest);
router.get('/labtests/:labTestId', labTechController.getLabTestById);
router.get('/labtests', labTechController.listAllLabTests);
router.patch('/labtests/:labTestId/deactivate', labTechController.deactivateLabTest);

module.exports = router;
