const Consultation = require('../models/Consultation');

// Add Consultation Note
exports.addConsultationNote = async (req, res) => {
  try {
    const consultationData = req.body;
    const consultation = new Consultation(consultationData);
    await consultation.save();
    res.status(201).json({ message: 'Consultation note added successfully', consultation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Consultation Note
exports.updateConsultationNote = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const updateData = req.body;
    
    const consultation = await Consultation.findByIdAndUpdate(consultationId, updateData, { new: true });
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json({ message: 'Consultation note updated successfully', consultation });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Consultation Note by Appointment ID
exports.getConsultationByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const consultation = await Consultation.findOne({ appointment: appointmentId })
      .populate('doctor.user', '-password')
      .populate('patient');
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Consultation Notes by Doctor
exports.listConsultationsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const consultations = await Consultation.find({ 
      doctor: doctorId, 
      isActive: true 
    }).populate('patient').populate('appointment');
    
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Consultation History by Patient
exports.listConsultationHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const consultations = await Consultation.find({ 
      patient: patientId, 
      isActive: true 
    }).populate('doctor.user', '-password').populate('appointment');
    
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Consultation History by Appointment ID
exports.getConsultationHistoryByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const consultation = await Consultation.findOne({ appointment: appointmentId })
      .populate('doctor.user', '-password')
      .populate('patient');
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation history not found' });
    }
    
    res.json(consultation);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 