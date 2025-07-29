const express = require('express');
const router = express.Router();
const controller = require('../controllers/labtechController');
const validator = require('../validation/labTechValidation');
const validate = require('../middlewares/validateRequest');

router.post('/labtests', validator.validateLabTest, validate, controller.addLabTest);
router.put('/labtests/:labTestId', validator.validateLabTest, validate, controller.updateLabTest);
router.get('/labtests/:labTestId', controller.getLabTestById);
router.get('/labtests', controller.listAllLabTests);
router.patch('/labtests/:labTestId/deactivate', controller.deactivateLabTest);

router.put('/labtests/results/:labTestPrescriptionId', validator.validateLabResult, validate, controller.recordLabResult);
router.get('/labtests/results/appointment/:appointmentId', controller.getResultByAppointment);
router.get('/labtests/results', controller.listResultsByDateRange);
router.patch('/labtests/:labTestPrescriptionId/deactivate', controller.deactivateLabPrescription);

module.exports = router;
