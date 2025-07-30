const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// All routes are now public

// Medicine Management Routes
router.post('/', medicineController.addMedicine);
router.put('/:medicineId', medicineController.updateMedicine);
router.get('/:medicineId', medicineController.getMedicineById);
router.get('/', medicineController.listAllMedicines);
router.patch('/:medicineId/deactivate', medicineController.deactivateMedicine);

module.exports = router; 