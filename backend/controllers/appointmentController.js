const Appointment = require('../models/Appointment');
const { generateId } = require('../utils/counter');

// Schedule Appointment
exports.scheduleAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    
    // Generate appointment ID
    const appointmentId = await generateId('APT', 'appointment');
    appointmentData.appointmentId = appointmentId;
    
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res.status(201).json({ message: 'Appointment scheduled successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('doctor')
      .populate('doctor.user', '-password');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Appointments by Date
exports.listAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    const appointments = await Appointment.find({
      appointmentDate: { $gte: startDate, $lt: endDate },
      isActive: true
    }).populate('patient').populate('doctor.user', '-password');
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Appointments by Patient
exports.listAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ 
      patient: patientId, 
      isActive: true 
    }).populate('doctor.user', '-password');
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Appointments by Doctor
exports.listAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ 
      doctor: doctorId, 
      isActive: true 
    }).populate('patient');
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Appointments with Status
exports.getAppointmentsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const appointments = await Appointment.find({ 
      status, 
      isActive: true 
    }).populate('patient').populate('doctor.user', '-password');
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 