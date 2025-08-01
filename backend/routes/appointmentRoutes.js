const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  scheduleAppointment,
  updateAppointment,
  getAppointmentById,
  listAppointmentsByDate,
  cancelAppointment,
  listAppointmentsByPatient,
  listAppointmentsByDoctor,
  getAppointmentsByStatus
} = require('../controllers/appointmentController');

// Validation middleware
const validateAppointmentSchedule = [
  body('patientId').isMongoId().withMessage('Valid patient ID is required'),
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Please provide a valid appointment date'),
  body('appointmentTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide a valid time in HH:MM format'),
  body('duration').optional().isInt({ min: 15, max: 120 }).withMessage('Duration must be between 15 and 120 minutes'),
  body('type').optional().isIn(['consultation', 'follow-up', 'emergency', 'routine']).withMessage('Invalid appointment type'),
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters long'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level')
];

const validateAppointmentUpdate = [
  body('patientId').optional().isMongoId().withMessage('Valid patient ID is required'),
  body('doctorId').optional().isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').optional().isISO8601().withMessage('Please provide a valid appointment date'),
  body('appointmentTime').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide a valid time in HH:MM format'),
  body('duration').optional().isInt({ min: 15, max: 120 }).withMessage('Duration must be between 15 and 120 minutes'),
  body('type').optional().isIn(['consultation', 'follow-up', 'emergency', 'routine']).withMessage('Invalid appointment type'),
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters long'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level')
];

const validateAppointmentCancellation = [
  body('cancellationReason').trim().isLength({ min: 5 }).withMessage('Cancellation reason must be at least 5 characters long')
];

// Routes
// Schedule Appointment: POST /api/appointments
router.post('/', auth, authorize(['receptionist', 'admin']), validateAppointmentSchedule, scheduleAppointment);

// Update Appointment: PUT /api/appointments/{appointmentId}
router.put('/:appointmentId', auth, authorize(['receptionist', 'admin']), validateAppointmentUpdate, updateAppointment);

// Get Appointment by ID: GET /api/appointments/{appointmentId}
router.get('/:appointmentId', auth, authorize(['receptionist', 'admin', 'doctor', 'nurse']), getAppointmentById);

// List Appointments by Date: GET /api/appointments?date={appointmentDate}
router.get('/', auth, authorize(['receptionist', 'admin', 'doctor', 'nurse']), listAppointmentsByDate);

// Cancel Appointment: PATCH /api/appointments/{appointmentId}/cancel
router.patch('/:appointmentId/cancel', auth, authorize(['receptionist', 'admin']), validateAppointmentCancellation, cancelAppointment);

// List Appointments by Patient: GET /api/appointments/patient/{patientId}
router.get('/patient/:patientId', auth, authorize(['receptionist', 'admin', 'doctor', 'nurse']), listAppointmentsByPatient);

// List Appointments by Doctor: GET /api/appointments/doctor/{doctorId}
router.get('/doctor/:doctorId', auth, authorize(['receptionist', 'admin', 'doctor', 'nurse']), listAppointmentsByDoctor);

// Get Appointments with Status: GET /api/appointments?status={status}
// This is handled by the main GET route with query parameters

module.exports = router; 