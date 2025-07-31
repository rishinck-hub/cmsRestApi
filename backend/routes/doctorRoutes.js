const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Doctor Management Routes
router.post('/', doctorController.createDoctor);
router.put('/:doctorId', doctorController.updateDoctor);
router.get('/:doctorId', doctorController.getDoctorById);
router.get('/', doctorController.listAllDoctors);
router.patch('/:doctorId/deactivate', doctorController.deactivateDoctor);

module.exports = router; 