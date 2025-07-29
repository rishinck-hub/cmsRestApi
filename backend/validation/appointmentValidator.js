const { body, param, query } = require('express-validator');

exports.createAppointmentValidator = [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('reason').optional().isString()
];

exports.updateAppointmentValidator = [
  param('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
  body('appointmentDate').optional().isISO8601().withMessage('Invalid date'),
  body('timeSlot').optional().notEmpty(),
  body('reason').optional().isString(),
  body('status').optional().isIn(['Scheduled', 'Completed', 'Cancelled'])
];

exports.cancelAppointmentValidator = [
  param('appointmentId').isMongoId().withMessage('Invalid appointment ID')
];

exports.getAppointmentByIdValidator = [
  param('appointmentId').isMongoId().withMessage('Invalid appointment ID')
];

exports.appointmentByDateValidator = [
  query('date').isISO8601().withMessage('Invalid date format')
];

exports.appointmentStatusValidator = [
  query('status').isIn(['Scheduled', 'Completed', 'Cancelled']).withMessage('Invalid status')
];
