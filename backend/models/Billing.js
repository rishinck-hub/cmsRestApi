const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  consultationFee: { type: Number, required: true, default: 0 },
  medicineCost: { type: Number, default: 0 },
  labTestCost: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'partial'], 
    default: 'pending' 
  },
  paymentDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Billing', BillingSchema); 