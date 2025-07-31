const { body } = require('express-validator');

const staffValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('address').notEmpty().withMessage('Address is required'),
    body('contactNo').matches(/^\d{10}$/).withMessage('Contact number must be 10 digits'),
    body('age').isInt({ min: 18 }).withMessage('Minimum age is 18'),
    body('roleId').isInt({ min: 1, max: 5 }).withMessage('Invalid roleId'),
    // Only required for doctors (roleId == 2)
    body('specializationId').if((value, { req }) => req.body.roleId == 2).notEmpty().withMessage('Specialization ID is required for doctors'),
    body('consultationFee').if((value, { req }) => req.body.roleId == 2).isNumeric().withMessage('Consultation fee must be a number'),
    body('workingDays').if((value, { req }) => req.body.roleId == 2).notEmpty().withMessage('Working days are required for doctors')
];

module.exports =staffValidator;

