const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  symptoms: { type: String },
  diagnosis: { type: String },
  treatment: { type: String },
  notes: { type: String },
  followUpDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema); 