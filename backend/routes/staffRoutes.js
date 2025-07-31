const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Staff Management Routes
router.post('/', staffController.createStaff);
router.put('/:staffId', staffController.updateStaff);
router.get('/:staffId', staffController.getStaffById);
router.get('/', staffController.listAllStaff);
router.patch('/:staffId/deactivate', staffController.deactivateStaff);

module.exports = router; 