const Patient = require('../models/Patient');
const { generateId } = require('../utils/counter');

// Register Patient
exports.registerPatient = async (req, res) => {
  try {
    const patientData = req.body;
    
    // Generate patient ID
    const patientId = await generateId('PAT', 'patient');
    patientData.patientId = patientId;
    
    const patient = new Patient(patientData);
    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Patient Information
exports.updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;
    
    const patient = await Patient.findByIdAndUpdate(patientId, updateData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient updated successfully', patient });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Patients
exports.listAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Patient
exports.deactivatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patient.isActive = false;
    await patient.save();
    
    res.json({ message: 'Patient deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 