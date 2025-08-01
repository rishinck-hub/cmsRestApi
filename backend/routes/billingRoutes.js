const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  generateAppointmentBill,
  updateAppointmentBill,
  getBillByAppointmentId,
  listBillsByDateRange,
  getBillById,
  processPayment
} = require('../controllers/billingController');

// Validation middleware
const validateBillGeneration = [
  body('appointmentId').isMongoId().withMessage('Valid appointment ID is required'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('additionalCharges').optional().isArray().withMessage('Additional charges must be an array'),
  body('additionalCharges.*.description').optional().trim().isLength({ min: 1 }).withMessage('Charge description is required'),
  body('additionalCharges.*.amount').optional().isFloat({ min: 0 }).withMessage('Charge amount must be a positive number'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be a positive number'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'insurance', 'online']).withMessage('Invalid payment method'),
  body('dueDate').isISO8601().withMessage('Please provide a valid due date')
];

const validateBillUpdate = [
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('additionalCharges').optional().isArray().withMessage('Additional charges must be an array'),
  body('additionalCharges.*.description').optional().trim().isLength({ min: 1 }).withMessage('Charge description is required'),
  body('additionalCharges.*.amount').optional().isFloat({ min: 0 }).withMessage('Charge amount must be a positive number'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be a positive number'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'insurance', 'online']).withMessage('Invalid payment method'),
  body('paidAmount').optional().isFloat({ min: 0 }).withMessage('Paid amount must be a positive number')
];

const validatePayment = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be greater than 0'),
  body('paymentMethod').isIn(['cash', 'card', 'insurance', 'online']).withMessage('Invalid payment method'),
  body('notes').optional().trim().isLength({ min: 1 }).withMessage('Notes must not be empty if provided')
];

// Routes
// Generate Appointment Bill: POST /api/billing
router.post('/', auth, authorize(['receptionist', 'admin']), validateBillGeneration, generateAppointmentBill);

// Update Appointment Bill: PUT /api/billing/{appointmentId}
router.put('/:appointmentId', auth, authorize(['receptionist', 'admin']), validateBillUpdate, updateAppointmentBill);

// Get Bill by Appointment ID: GET /api/billing/{appointmentId}
router.get('/:appointmentId', auth, authorize(['receptionist', 'admin', 'doctor']), getBillByAppointmentId);

// List Bills by Date Range: GET /api/billing?startDate={startDate}&endDate={endDate}
router.get('/', auth, authorize(['receptionist', 'admin']), listBillsByDateRange);

// Get Bill by ID: GET /api/billing/id/{billingId}
router.get('/id/:billingId', auth, authorize(['receptionist', 'admin', 'doctor']), getBillById);

// Process Payment: POST /api/billing/{billingId}/payment
router.post('/:billingId/payment', auth, authorize(['receptionist', 'admin']), validatePayment, processPayment);

module.exports = router; 