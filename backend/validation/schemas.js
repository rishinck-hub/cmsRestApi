const { validateRequiredFields, validateObjectId, validateEmail, validatePhone, validateStringLength } = require('./fieldValidation');

// Prescription validation schema
exports.validatePrescriptionData = (data) => {
  const errors = {};
  
  // Required fields
  const requiredFields = ['consultation', 'appointmentId', 'doctor', 'patientId'];
  const missingFields = validateRequiredFields(data, requiredFields);
  if (missingFields.length > 0) {
    errors.missingFields = missingFields;
  }
  
  // ObjectId validations
  if (data.consultation) {
    const consultationError = validateObjectId(data.consultation, 'consultation ID');
    if (consultationError) errors.consultation = consultationError;
  }
  
  if (data.doctor) {
    const doctorError = validateObjectId(data.doctor, 'doctor ID');
    if (doctorError) errors.doctor = doctorError;
  }
  
  // String length validations
  if (data.appointmentId) {
    const appointmentIdError = validateStringLength(data.appointmentId, 1, 50, 'Appointment ID');
    if (appointmentIdError) errors.appointmentId = appointmentIdError;
  }
  
  if (data.patientId) {
    const patientIdError = validateStringLength(data.patientId, 1, 50, 'Patient ID');
    if (patientIdError) errors.patientId = patientIdError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Medicine prescription validation schema
exports.validateMedicinePrescriptionData = (data) => {
  const errors = {};
  
  // Base prescription validation
  const prescriptionErrors = this.validatePrescriptionData(data);
  if (prescriptionErrors) {
    Object.assign(errors, prescriptionErrors);
  }
  
  // Medicine-specific required fields
  const medicineRequiredFields = ['medicineId', 'dosage', 'duration'];
  const missingMedicineFields = validateRequiredFields(data, medicineRequiredFields);
  if (missingMedicineFields.length > 0) {
    errors.missingMedicineFields = missingMedicineFields;
  }
  
  // Medicine-specific validations
  if (data.medicineId) {
    const medicineIdError = validateStringLength(data.medicineId, 1, 100, 'Medicine ID');
    if (medicineIdError) errors.medicineId = medicineIdError;
  }
  
  if (data.dosage) {
    const dosageError = validateStringLength(data.dosage, 1, 100, 'Dosage');
    if (dosageError) errors.dosage = dosageError;
  }
  
  if (data.duration) {
    const durationError = validateStringLength(data.duration, 1, 100, 'Duration');
    if (durationError) errors.duration = durationError;
  }
  
  if (data.instructions) {
    const instructionsError = validateStringLength(data.instructions, 0, 500, 'Instructions');
    if (instructionsError) errors.instructions = instructionsError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Lab test prescription validation schema
exports.validateLabTestPrescriptionData = (data) => {
  const errors = {};
  
  // Base prescription validation
  const prescriptionErrors = this.validatePrescriptionData(data);
  if (prescriptionErrors) {
    Object.assign(errors, prescriptionErrors);
  }
  
  // Lab test-specific required fields
  const labTestRequiredFields = ['labTestId'];
  const missingLabTestFields = validateRequiredFields(data, labTestRequiredFields);
  if (missingLabTestFields.length > 0) {
    errors.missingLabTestFields = missingLabTestFields;
  }
  
  // Lab test-specific validations
  if (data.labTestId) {
    const labTestIdError = validateStringLength(data.labTestId, 1, 100, 'Lab Test ID');
    if (labTestIdError) errors.labTestId = labTestIdError;
  }
  
  if (data.instructions) {
    const instructionsError = validateStringLength(data.instructions, 0, 500, 'Instructions');
    if (instructionsError) errors.instructions = instructionsError;
  }
  
  if (data.results) {
    const resultsError = validateStringLength(data.results, 0, 1000, 'Results');
    if (resultsError) errors.results = resultsError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// User validation schema
exports.validateUserData = (data) => {
  const errors = {};
  
  // Required fields
  const requiredFields = ['name', 'email', 'role'];
  const missingFields = validateRequiredFields(data, requiredFields);
  if (missingFields.length > 0) {
    errors.missingFields = missingFields;
  }
  
  // Email validation
  if (data.email) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
  }
  
  // String length validations
  if (data.name) {
    const nameError = validateStringLength(data.name, 2, 100, 'Name');
    if (nameError) errors.name = nameError;
  }
  
  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }
  
  // Role validation
  const validRoles = ['patient', 'doctor', 'admin'];
  if (data.role && !validRoles.includes(data.role)) {
    errors.role = 'Role must be one of: patient, doctor, admin';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}; 