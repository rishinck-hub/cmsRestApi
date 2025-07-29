// routes/pharmacistRoutes.js
const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');

// Medicine Management
router.post('/medicines', pharmacistController.addMedicine);
router.put('/medicines/:medicineId', pharmacistController.updateMedicine);
router.get('/medicines/:medicineId', pharmacistController.getMedicineById);
router.get('/medicines', pharmacistController.listAllMedicines);
router.patch('/medicines/:medicineId/deactivate', pharmacistController.deactivateMedicine);

// Inventory Management
router.post('/inventory/medicine', pharmacistController.addInventoryItem);
router.put('/inventory/medicine/:medicineStockId', pharmacistController.updateInventory);
router.get('/inventory/medicine/:medicineId', pharmacistController.getInventoryByMedicine);
router.get('/inventory/medicine', pharmacistController.listAllInventory);
router.patch('/inventory/medicine/:medicineStockId/flag-low', pharmacistController.flagLowStock);

module.exports = router;
