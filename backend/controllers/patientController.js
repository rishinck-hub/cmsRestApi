const Patient = require('../models/Patient');
const { validationResult } = require('express-validator');

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      allergies,
      bloodGroup
    } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient with this email already exists' });
    }

    const patient = new Patient({
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      allergies,
      bloodGroup,
      registeredBy: req.user._id
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Patient Information
const updatePatient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId } = req.params;
    const updateData = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== patient.email) {
      const existingPatient = await Patient.findOne({ email: updateData.email });
      if (existingPatient) {
        return res.status(400).json({ message: 'Patient with this email already exists' });
      }
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Patient by ID
const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ patient });
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List All Patients
const listAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const patients = await Patient.find(query)
      .populate('registeredBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Patient.countDocuments(query);

    res.json({
      patients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error listing patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deactivate Patient
const deactivatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.isActive = false;
    await patient.save();

    res.json({
      message: 'Patient deactivated successfully',
      patient
    });
  } catch (error) {
    console.error('Error deactivating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerPatient,
  updatePatient,
  getPatientById,
  listAllPatients,
  deactivatePatient
}; 