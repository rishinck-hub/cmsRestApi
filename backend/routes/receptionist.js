const express = require('express');
const router = express.Router();

// Controllers
const patientController = require('../controllers/patientController');
const appointmentController = require('../controllers/appointmentController');
const billingController = require('../controllers/billingController');

// Validators
const {
  registerPatientValidator,
  updatePatientValidator
} = require('../validators/patientValidator');

const {
  createAppointmentValidator,
  updateAppointmentValidator
} = require('../validators/appointmentValidator');

const validate = require('../middleware/validateRequest');

// --------------------- Patient Management ---------------------

router.post('/patients', registerPatientValidator, validate, patientController.registerPatient);
router.put('/patients/:patientId', updatePatientValidator, validate, patientController.updatePatient);
router.get('/patients/:patientId', patientController.getPatientById);
router.get('/patients', patientController.getAllPatients);
router.patch('/patients/:patientId/deactivate', patientController.deactivatePatient);

// --------------------- Appointment Management ---------------------

router.post('/appointments', createAppointmentValidator, validate, appointmentController.scheduleAppointment);
router.put('/appointments/:appointmentId', updateAppointmentValidator, validate, appointmentController.updateAppointment);
router.get('/appointments/:appointmentId', appointmentController.getAppointmentById);
router.get('/appointments', appointmentController.getAppointmentsByDate); // expects ?date=
router.patch('/appointments/:appointmentId/cancel', appointmentController.cancelAppointment);

// --------------------- Consultation Billing ---------------------

router.post('/billing', billingController.generateBill);
router.put('/billing/:appointmentId', billingController.updateBill);
router.get('/billing/:appointmentId', billingController.getBillByAppointmentId);
router.get('/billing', billingController.getBillsByDateRange); // expects ?startDate= &endDate=

// --------------------- Appointment Listing ---------------------

router.get('/appointments/patient/:patientId', appointmentController.getAppointmentsByPatient);
router.get('/appointments/doctor/:doctorId', appointmentController.getAppointmentsByDoctor);
router.get('/appointments-status', appointmentController.getAppointmentsByStatus); // expects ?status=

module.exports = router;
