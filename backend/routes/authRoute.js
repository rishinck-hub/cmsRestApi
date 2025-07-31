const express = require('express');
const router = express.Router();

const loginValidator = require('../validators/authValidator');
const validator = require('../validators/validator');
const admCtrl = require('../controllers/adminController');


router.post('/login', loginValidator, validator, admCtrl.login);

module.exports = router;
