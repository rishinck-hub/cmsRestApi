const mongoose = require('mongoose');

const LabTestPrescriptionSchema = new mongoose.Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  labTest: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
  instructions: { type: String },
  results: { type: String },
  resultDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LabTestPrescription', LabTestPrescriptionSchema); 