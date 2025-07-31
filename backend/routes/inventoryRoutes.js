const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and pharmacist role
router.use(auth);
router.use(authorize('pharmacist', 'admin'));

// Medicine Inventory Management Routes
router.post('/medicine', inventoryController.addInventoryItem);
router.put('/medicine/:medicineStockId', inventoryController.updateInventoryQuantity);
router.get('/medicine/:medicineId', inventoryController.getInventoryByMedicineId);
router.get('/medicine', inventoryController.listAllInventoryItems);
router.patch('/medicine/:medicineStockId/flag-low', inventoryController.flagLowStock);

module.exports = router; 