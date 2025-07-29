// validators/pharmacistValidator.js
const { body } = require('express-validator');

exports.validateMedicine = [
  body('name').notEmpty().withMessage('Medicine name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').optional().isString(),
  body('brand').optional().isString(),
  body('description').optional().isString()
];

exports.validateInventory = [
  body('medicine').notEmpty().withMessage('Medicine ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('expiryDate').optional().isISO8601().toDate()
];
