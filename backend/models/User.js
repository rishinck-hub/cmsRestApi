const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist'], required: true },
  email: { type: String, required: true, unique: true },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);