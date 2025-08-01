const mongoose = require('mongoose');

const LabTestPrescriptionSchema = new mongoose.Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  appointmentId: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: String, required: true },
  labTestId: { type: String, required: true },
  instructions: { type: String },
  results: { type: String },
  resultDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LabTestPrescription', LabTestPrescriptionSchema); 