const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    contact: String,
    address: String,
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Patient', patientSchema);
