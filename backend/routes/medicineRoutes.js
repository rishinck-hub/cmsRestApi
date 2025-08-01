const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(auth);

// Medicine Management Routes (Admin & Pharmacist)
router.post('/', authorize('admin', 'pharmacist'), medicineController.addMedicine);
router.put('/:medicineId', authorize('admin', 'pharmacist'), medicineController.updateMedicine);
router.get('/:medicineId', authorize('admin', 'pharmacist', 'doctor'), medicineController.getMedicineById);
router.get('/', authorize('admin', 'pharmacist', 'doctor'), medicineController.listAllMedicines);
router.patch('/:medicineId/deactivate', authorize('admin', 'pharmacist'), medicineController.deactivateMedicine);

module.exports = router; 