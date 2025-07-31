const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and admin role
router.use(auth);
router.use(authorize('admin'));

// Role Management Routes
router.post('/', roleController.createRole);
router.put('/:roleId', roleController.updateRole);
router.get('/:roleId', roleController.getRoleById);
router.get('/', roleController.listAllRoles);
router.patch('/:roleId/deactivate', roleController.deactivateRole);

module.exports = router; 