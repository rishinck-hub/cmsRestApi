const express = require('express');
const router = express.Router();
const specializationController = require('../controllers/specializationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Specialization Management Routes
router.post('/', specializationController.addSpecialization);
router.put('/:specializationId', specializationController.updateSpecialization);
router.get('/:specializationId', specializationController.getSpecializationById);
router.get('/', specializationController.listAllSpecializations);

module.exports = router; 