const express = require('express');
const router = express.Router();

const { loginValidator,passwordResetValidator } = require('../validators/authValidator');
const validator = require('../validators/validator');
const admCtrl = require('../controllers/adminController');


router.post('/login', loginValidator, validator, admCtrl.login);
router.put('/resetPassword/:id',passwordResetValidator, validator, admCtrl.resetPassword);
module.exports = router;
