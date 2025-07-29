const express = require('express');
const router = express.Router();
const controller = require('../controllers/pharmacistController');
const validator = require('../validation/pharmacistValidator');
const validate = require('../middlewares/validateRequest');

router.post('/medicines', validator.validateMedicine, validate, controller.addMedicine);
router.put('/medicines/:medicineId', validator.validateMedicine, validate, controller.updateMedicine);
router.get('/medicines/:medicineId', controller.getMedicineById);
router.get('/medicines', controller.listAllMedicines);
router.patch('/medicines/:medicineId/deactivate', controller.deactivateMedicine);

router.post('/inventory/medicine', validator.validateInventory, validate, controller.addInventoryItem);
router.put('/inventory/medicine/:medicineStockId', validator.validateInventory, validate, controller.updateInventory);
router.get('/inventory/medicine/:medicineId', controller.getInventoryByMedicine);
router.get('/inventory/medicine', controller.listAllInventory);
router.patch('/inventory/medicine/:medicineStockId/flag-low', controller.flagLowStock);

module.exports = router;