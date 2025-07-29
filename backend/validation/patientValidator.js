const { body, param } = require('express-validator');

exports.createPatientValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0 }).withMessage('Valid age is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('contact').notEmpty().isLength({ min: 10 }).withMessage('Contact is required'),
  body('address').notEmpty().withMessage('Address is required')
];

exports.updatePatientValidator = [
  param('patientId').isMongoId().withMessage('Invalid patient ID'),
  body('name').optional().notEmpty(),
  body('age').optional().isInt({ min: 0 }),
  body('gender').optional().isIn(['Male', 'Female', 'Other']),
  body('contact').optional().isLength({ min: 10 }),
  body('address').optional().notEmpty()
];

exports.getPatientByIdValidator = [
  param('patientId').isMongoId().withMessage('Invalid patient ID')
];

exports.deactivatePatientValidator = [
  param('patientId').isMongoId().withMessage('Invalid patient ID')
];

