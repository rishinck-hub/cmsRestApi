const LabTestPrescription = require('../models/LabTestPrescription');
const mongoose = require('mongoose');
const { validateRequiredFields, validateObjectId, createValidationError, validateLabTestPrescriptionData } = require('../validation');

// Create Lab Test Prescription
exports.createLabTestPrescription = async (req, res) => {
  try {
    const prescriptionData = req.body;
    
    // Validate prescription data using schema
    const validationErrors = validateLabTestPrescriptionData(prescriptionData);
    if (validationErrors) {
      return createValidationError(res, 'Validation failed', validationErrors);
    }

    const prescription = new LabTestPrescription(prescriptionData);
    await prescription.save();
    
    // Populate doctor info for response
    await prescription.populate('doctor', '-password');
    await prescription.populate('consultation');
    
    res.status(201).json({ message: 'Lab test prescription created successfully', prescription });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Lab Test Prescription
exports.updateLabTestPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;
    
    // Validate ObjectId
    const prescriptionIdError = validateObjectId(prescriptionId, 'prescription ID');
    if (prescriptionIdError) {
      return createValidationError(res, prescriptionIdError);
    }
    
    const prescription = await LabTestPrescription.findByIdAndUpdate(
      prescriptionId, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('doctor', '-password').populate('consultation');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Lab test prescription not found' });
    }
    
    res.json({ message: 'Lab test prescription updated successfully', prescription });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Test Prescriptions by Appointment ID
exports.getLabTestPrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    if (!appointmentId) {
      return createValidationError(res, 'Appointment ID is required');
    }
    
    const prescriptions = await LabTestPrescription.find({ appointmentId: appointmentId })
      .populate('doctor', '-password')
      .populate('consultation')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Lab Test Prescriptions by Patient (active and history)
exports.listLabTestPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { active = 'true' } = req.query; // Query parameter to filter active/inactive
    
    if (!patientId) {
      return createValidationError(res, 'Patient ID is required');
    }
    
    const query = { patientId: patientId };
    
    // If active parameter is provided, filter by isActive status
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }
    // If active is not specified, return all prescriptions
    
    const prescriptions = await LabTestPrescription.find(query)
      .populate('doctor', '-password')
      .populate('consultation')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Lab Test Prescriptions by Doctor (active and history)
exports.listLabTestPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { active = 'true' } = req.query; // Query parameter to filter active/inactive
    
    const doctorIdError = validateObjectId(doctorId, 'doctor ID');
    if (doctorIdError) {
      return createValidationError(res, doctorIdError);
    }
    
    const query = { doctor: doctorId };
    
    // If active parameter is provided, filter by isActive status
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }
    // If active is not specified, return all prescriptions
    
    const prescriptions = await LabTestPrescription.find(query)
      .populate('doctor', '-password')
      .populate('consultation')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single lab test prescription by ID
exports.getLabTestPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescriptionIdError = validateObjectId(prescriptionId, 'prescription ID');
    if (prescriptionIdError) {
      return createValidationError(res, prescriptionIdError);
    }
    
    const prescription = await LabTestPrescription.findById(prescriptionId)
      .populate('doctor', '-password')
      .populate('consultation');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Lab test prescription not found' });
    }
    
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Soft delete lab test prescription (set isActive to false)
exports.deactivateLabTestPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescriptionIdError = validateObjectId(prescriptionId, 'prescription ID');
    if (prescriptionIdError) {
      return createValidationError(res, prescriptionIdError);
    }
    
    const prescription = await LabTestPrescription.findByIdAndUpdate(
      prescriptionId,
      { isActive: false },
      { new: true }
    ).populate('doctor', '-password').populate('consultation');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Lab test prescription not found' });
    }
    
    res.json({ message: 'Lab test prescription deactivated successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 