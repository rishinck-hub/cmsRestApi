// validators/labTechValidator.js
const { body } = require('express-validator');

exports.validateLabTest = [
  body('name').notEmpty().withMessage('Lab test name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').optional().isString()
];

exports.validateLabResult = [
  body('resultData').notEmpty().withMessage('Result data is required'),
];
