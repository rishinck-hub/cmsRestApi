const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: { type: String, unique: true },
  specialization: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialization', required: true },
  experience: { type: Number, default: 0 },
  education: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema); 