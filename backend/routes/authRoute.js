const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validation/authValidation');

// Register Route
router.post('/register', (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }
  next();
}, authController.register);

// Login Route
router.post('/login', (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({ message: 'Validation error', details: error.details });
  }
  next();
}, authController.login);

module.exports = router;
