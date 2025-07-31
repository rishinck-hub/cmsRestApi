const mongoose = require('mongoose');

const LabTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  result: { type: String },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // lab technician
  resultDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LabTest', LabTestSchema); 