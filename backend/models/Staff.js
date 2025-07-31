const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, unique: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  hireDate: { type: Date, default: Date.now },
  salary: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema); 