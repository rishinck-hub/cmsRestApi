const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authControllers');

// Validators
const { registerValidator, loginValidator } = require('../validators/authValidator');
const validate = require('../middleware/validateRequest');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerValidator, validate, authController.register);

// @route   POST /api/auth/login
// @desc    Log in a user
router.post('/login', loginValidator, validate, authController.login);

module.exports = router;
