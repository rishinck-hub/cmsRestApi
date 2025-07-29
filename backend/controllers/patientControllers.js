const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.patientId, req.body, { new: true });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deactivatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.patientId,
            { active: false },
            { new: true }
        );
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
