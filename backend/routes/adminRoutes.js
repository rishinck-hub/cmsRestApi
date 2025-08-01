const express = require('express');
const router = express.Router();
const admCtrl = require('../controllers/adminController');
const {authenticateToken,authorizeRoles}=require("../controllers/authController");
const {staffValidator,updateStaffValidator} = require("../validators/staffValidator");
const { loginValidator, passwordResetValidator } = require("../validators/authValidator");
const validator = require('../validators/validator');

router.use(authenticateToken);
router.use(authorizeRoles(1));

// All routes below require authentication + admin access
router.use(authenticateToken);
router.use(authorizeRoles("1"));
router.post('/addStaff',staffValidator, validator, admCtrl.addStaff);
router.get('/allStaff', validator, admCtrl.getAllStaff);
router.patch('/updateStaff/:id',updateStaffValidator, validator, admCtrl.updateStaff);
router.put('/deactivateStaff/:id', validator, admCtrl.deactivateStaff);
router.put('/resetPassword/:staffId', validator, admCtrl.resetPassword);

module.exports = router;
