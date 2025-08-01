const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  labTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabTest',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  results: {
    type: String,
    required: true
  },
  resultDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  },
  labTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('LabResult', labResultSchema);
