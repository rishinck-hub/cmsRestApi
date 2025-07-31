const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// All routes require authentication and receptionist role
router.use(auth);
router.use(authorize('receptionist', 'admin'));

// Consultation Billing Routes
router.post('/', billingController.generateAppointmentBill);
router.put('/:appointmentId', billingController.updateAppointmentBill);
router.get('/:appointmentId', billingController.getBillByAppointmentId);
router.get('/', billingController.listBillsByDateRange);

module.exports = router; 