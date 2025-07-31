const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: { type: String },
  bloodGroup: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  },
  medicalHistory: { type: String },
  allergies: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema); 