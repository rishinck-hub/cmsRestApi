const MedicinePrescription = require('../models/MedicinePrescription');

// Create Medicine Prescription
exports.createMedicinePrescription = async (req, res) => {
  try {
    const prescriptionData = req.body;
    const prescription = new MedicinePrescription(prescriptionData);
    await prescription.save();
    res.status(201).json({ message: 'Medicine prescription created successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Medicine Prescription
exports.updateMedicinePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;
    
    const prescription = await MedicinePrescription.findByIdAndUpdate(prescriptionId, updateData, { new: true });
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json({ message: 'Medicine prescription updated successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Prescription by Appointment ID
exports.getPrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescriptions = await MedicinePrescription.find({ appointment: appointmentId })
      .populate('medicine')
      .populate('doctor.user', '-password')
      .populate('patient');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Prescriptions by Patient
exports.listPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await MedicinePrescription.find({ 
      patient: patientId, 
      isActive: true 
    }).populate('medicine').populate('doctor.user', '-password');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Medicine Prescription History by Patient
exports.listMedicinePrescriptionHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await MedicinePrescription.find({ 
      patient: patientId, 
      isActive: true 
    }).populate('medicine').populate('doctor.user', '-password').populate('appointment');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Medicine Prescription History by Doctor
exports.listMedicinePrescriptionHistoryByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const prescriptions = await MedicinePrescription.find({ 
      doctor: doctorId, 
      isActive: true 
    }).populate('medicine').populate('patient').populate('appointment');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Medicine Prescription History by Appointment ID
exports.getMedicinePrescriptionHistoryByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescriptions = await MedicinePrescription.find({ appointment: appointmentId })
      .populate('medicine')
      .populate('doctor.user', '-password')
      .populate('patient');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 