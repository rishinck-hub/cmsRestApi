const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { generateId } = require('../utils/counter');

// Create Doctor Profile
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, education } = req.body;
    
    // Create user first
    const user = new User({ name, email, password, role: 'doctor' });
    await user.save();
    
    // Generate license number
    const licenseNumber = await generateId('DOC', 'doctor');
    
    // Create doctor profile
    const doctor = new Doctor({
      user: user._id,
      licenseNumber,
      specialization,
      experience,
      education
    });
    await doctor.save();
    
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Doctor Profile
exports.updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, email, licenseNumber, specialization, experience, education } = req.body;
    
    const doctor = await Doctor.findById(doctorId).populate('user');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Update user info
    if (name) doctor.user.name = name;
    if (email) doctor.user.email = email;
    await doctor.user.save();
    
    // Update doctor info
    if (licenseNumber) doctor.licenseNumber = licenseNumber;
    if (specialization) doctor.specialization = specialization;
    if (experience) doctor.experience = experience;
    if (education) doctor.education = education;
    await doctor.save();
    
    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId)
      .populate('user', '-password')
      .populate('specialization');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Doctors
exports.listAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .populate('user', '-password')
      .populate('specialization');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Doctor
exports.deactivateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    doctor.isActive = false;
    await doctor.save();
    
    // Also deactivate the user
    await User.findByIdAndUpdate(doctor.user, { isActive: false });
    
    res.json({ message: 'Doctor deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 