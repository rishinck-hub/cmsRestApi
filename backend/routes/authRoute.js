const express = require('express');
const router = express.Router();

const loginValidator = require('../validation/authValidator');
const validator = require('../validation/validator');
const admCtrl = require('../controllers/adminController');


router.post('/login', loginValidator, validator, admCtrl.login);

module.exports = router;
