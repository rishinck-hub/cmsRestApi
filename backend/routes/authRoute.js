const express = require('express');
const router = express.Router(); // consistent variable name

const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../validation/authValidation');

// Register Route
router.post('/register', registerValidation, validate, authController.register);

// Login Route
router.post('/login', loginValidation, validate, authController.login);

module.exports = router;
