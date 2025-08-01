const MedicinePrescription = require('../models/MedicinePrescription');
const mongoose = require('mongoose');
const { validateRequiredFields, validateObjectId, createValidationError, validateMedicinePrescriptionData } = require('../validation');

// Create Medicine Prescription
exports.createMedicinePrescription = async (req, res) => {
  try {
    const prescriptionData = req.body;
    
    // Validate prescription data using schema
    const validationErrors = validateMedicinePrescriptionData(prescriptionData);
    if (validationErrors) {
      return createValidationError(res, 'Validation failed', validationErrors);
    }

    const prescription = new MedicinePrescription(prescriptionData);
    await prescription.save();
    
    // Populate doctor info for response
    await prescription.populate('doctor', '-password');
    await prescription.populate('consultation');
    
    res.status(201).json({ message: 'Medicine prescription created successfully', prescription });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Medicine Prescription
exports.updateMedicinePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;
    
    // Validate ObjectId
    const prescriptionIdError = validateObjectId(prescriptionId, 'prescription ID');
    if (prescriptionIdError) {
      return createValidationError(res, prescriptionIdError);
    }
    
    const prescription = await MedicinePrescription.findByIdAndUpdate(
      prescriptionId, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('doctor', '-password').populate('consultation');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json({ message: 'Medicine prescription updated successfully', prescription });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Prescriptions by Appointment ID
exports.getPrescriptionsByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    if (!appointmentId) {
      return createValidationError(res, 'Appointment ID is required');
    }
    
    const prescriptions = await MedicinePrescription.find({ appointmentId: appointmentId })
      .populate('doctor', '-password')
      .populate('consultation')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Prescriptions by Patient (active and history)
exports.listPrescriptionsByPatient = async (req, res) => {
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
    
    const prescriptions = await MedicinePrescription.find(query)
      .populate('doctor', '-password')
      .populate('consultation')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Prescriptions by Doctor (active and history)
exports.listPrescriptionsByDoctor = async (req, res) => {
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
    
    const prescriptions = await MedicinePrescription.find(query)
      .populate('doctor', '-password')
      .populate('consultation')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescriptionIdError = validateObjectId(prescriptionId, 'prescription ID');
    if (prescriptionIdError) {
      return createValidationError(res, prescriptionIdError);
    }
    
    const prescription = await MedicinePrescription.findById(prescriptionId)
      .populate('doctor', '-password')
      .populate('consultation');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Soft delete prescription (set isActive to false)
exports.deactivatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescriptionIdError = validateObjectId(prescriptionId, 'prescription ID');
    if (prescriptionIdError) {
      return createValidationError(res, prescriptionIdError);
    }
    
    const prescription = await MedicinePrescription.findByIdAndUpdate(
      prescriptionId,
      { isActive: false },
      { new: true }
    ).populate('doctor', '-password').populate('consultation');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json({ message: 'Prescription deactivated successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 