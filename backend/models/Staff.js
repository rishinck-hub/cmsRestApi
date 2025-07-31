const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  staffId: { type: String, unique: true },
  name: { type: String, required: true },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        if (this.roleId === 2) return value >= 25;
        return value >= 18;
      },
      message: "Age not valid for this role",
    },
  },
  email: { type: String, required: true, unique: true }, // 
  address: { type: String },
  contactNo: {
    type: String,
    required: true,
    match: [/^\d{10}$/,'Contact number must be exactly 10 digits']},
  password: { type: String, required: true }, 

  // If role is doctor (roleId === 2)
  specializationId: {
    type: String,
    ref: "Specialization",
    required: function () {
      return this.roleId === 2;
    },
  },
  consultationFee: {
    type: Number,
    required: function () {
      return this.roleId === 2;
    },
  },
  workingDays: {
    type: [String],
    required: function () {
      return this.roleId === 2;
    },
  },

  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Staff", staffSchema);
