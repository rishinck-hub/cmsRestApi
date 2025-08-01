const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: String, required: true },
  symptoms: { type: String },
  diagnosis: { type: String },
  treatment: { type: String },
  notes: { type: String },
  followUpDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema); 