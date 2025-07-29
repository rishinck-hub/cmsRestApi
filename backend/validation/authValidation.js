const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { loginValidation } = require('../validation/authValidation');
const validate = require('../middlewares/validateRequest');

router.post('/login', loginValidation, validate, login);

module.exports = router;


// 📁 validation/authValidation.js
const { body } = require('express-validator');

exports.loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];
