const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  registerPatient,
  updatePatient,
  getPatientById,
  listAllPatients,
  deactivatePatient
} = require('../controllers/patientController');

// Validation middleware
const validatePatientRegistration = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group')
];

const validatePatientUpdate = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group')
];

// Routes
// Register Patient: POST /api/patients
router.post('/', auth, authorize(['receptionist', 'admin']), validatePatientRegistration, registerPatient);

// Update Patient Information: PUT /api/patients/{patientId}
router.put('/:patientId', auth, authorize(['receptionist', 'admin']), validatePatientUpdate, updatePatient);

// Get Patient by ID: GET /api/patients/{patientId}
router.get('/:patientId', auth, authorize(['receptionist', 'admin', 'doctor', 'nurse']), getPatientById);

// List All Patients: GET /api/patients
router.get('/', auth, authorize(['receptionist', 'admin', 'doctor', 'nurse']), listAllPatients);

// Deactivate Patient: PATCH /api/patients/{patientId}/deactivate
router.patch('/:patientId/deactivate', auth, authorize(['receptionist', 'admin']), deactivatePatient);

module.exports = router; 