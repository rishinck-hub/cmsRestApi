const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  dosage: { type: String },
  manufacturer: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  expiryDate: { type: Date, required: true },
  batchNumber: { type: String },
  prescriptionRequired: { type: Boolean, default: false },
  type: { type: String }, // Tablet, Syrup, Injection, etc.
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema); 