const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  dosage: { type: String },
  manufacturer: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema); 