const express = require('express');
const router = express.Router();
const admCtrl = require('../controllers/adminController');
const {authenticateToken,authorizeRoles}=require("../controllers/authController");
const staffValidator = require("../validators/staffValidator");
const { loginValidator, passwordResetValidator } = require("../validators/authValidator");
const validator = require('../validators/validator');

router.use(authenticateToken);
router.use(authorizeRoles(1));

// All routes below require authentication + admin access
router.use(authenticateToken);
router.use(authorizeRoles(1));
router.post('/addStaff',staffValidator, validator, admCtrl.addStaff);
router.get('/allStaff', validator, admCtrl.getAllStaff);
router.put('/updateStaff/:id',staffValidator, validator, admCtrl.updateStaff);
router.put('/deactivateStaff/:id', validator, admCtrl.deactivateStaff);


module.exports = router;
