const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientControllers');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and receptionist role
router.use(auth);
router.use(authorize('receptionist', 'admin'));

// Patient Management Routes
router.post('/', patientController.registerPatient);
router.put('/:patientId', patientController.updatePatient);
router.get('/:patientId', patientController.getPatientById);
router.get('/', patientController.listAllPatients);
router.patch('/:patientId/deactivate', patientController.deactivatePatient);

module.exports = router; 