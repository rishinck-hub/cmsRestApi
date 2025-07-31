const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and pharmacist role
router.use(auth);
router.use(authorize('pharmacist', 'admin'));

// Medicine Management Routes
router.post('/', medicineController.addMedicine);
router.put('/:medicineId', medicineController.updateMedicine);
router.get('/:medicineId', medicineController.getMedicineById);
router.get('/', medicineController.listAllMedicines);
router.patch('/:medicineId/deactivate', medicineController.deactivateMedicine);

module.exports = router; 