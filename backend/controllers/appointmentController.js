const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Schedule Appointment
const scheduleAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      duration,
      type,
      reason,
      notes,
      symptoms,
      priority
    } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists and is a doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for appointment conflicts
    const appointmentDateObj = new Date(appointmentDate);
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime,
      status: { $nin: ['cancelled', 'no-show'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime,
      duration,
      type,
      reason,
      notes,
      symptoms,
      priority,
      scheduledBy: req.user._id
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('scheduledBy', 'name email');

    res.status(201).json({
      message: 'Appointment scheduled successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check for conflicts if date/time is being updated
    if (updateData.appointmentDate || updateData.appointmentTime) {
      const appointmentDate = updateData.appointmentDate || appointment.appointmentDate;
      const appointmentTime = updateData.appointmentTime || appointment.appointmentTime;
      const doctorId = updateData.doctor || appointment.doctor;

      const existingAppointment = await Appointment.findOne({
        _id: { $ne: appointmentId },
        doctor: doctorId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        status: { $nin: ['cancelled', 'no-show'] }
      });

      if (existingAppointment) {
        return res.status(400).json({ message: 'Time slot is already booked' });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone patientId')
     .populate('doctor', 'name email')
     .populate('scheduledBy', 'name email');

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('scheduledBy', 'name email')
      .populate('cancelledBy', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Appointments by Date
const listAppointmentsByDate = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error listing appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user._id;
    appointment.cancellationReason = cancellationReason;
    appointment.cancellationDate = new Date();

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .populate('cancelledBy', 'name email');

    res.json({
      message: 'Appointment cancelled successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Appointments by Patient
const listAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { patient: patientId };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email')
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error listing patient appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Appointments by Doctor
const listAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10, status, date } = req.query;

    const query = { doctor: doctorId };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone patientId')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error listing doctor appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Appointments with Status
const getAppointmentsByStatus = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone patientId')
      .populate('doctor', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error listing appointments by status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  scheduleAppointment,
  updateAppointment,
  getAppointmentById,
  listAppointmentsByDate,
  cancelAppointment,
  listAppointmentsByPatient,
  listAppointmentsByDoctor,
  getAppointmentsByStatus
}; 