const { body } = require('express-validator');

const loginValidator = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('roleId').isInt({ min: 1, max: 5 }).withMessage('Role ID must be between 1 and 5')
];



module.exports = loginValidator;
