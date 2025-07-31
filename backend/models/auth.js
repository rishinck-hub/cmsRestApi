const mongoose = require('mongoose');

// Patient Schema 
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactNumber: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

//  Appointment Schema 
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true }, // Assuming doctor is also staff
  appointmentDate: { type: Date, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  reason: { type: String },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Billing Schema 
const billingSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  consultationFee: { type: Number, required: true },
  labCharges: { type: Number, default: 0 },
  medicineCharges: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  billingDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Billing = mongoose.model('Billing', billingSchema);

// Export Models 
module.exports = {
  Patient,
  Appointment,
  Billing
};
