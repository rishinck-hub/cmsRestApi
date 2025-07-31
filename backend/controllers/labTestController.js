const LabTest = require('../models/LabTest');
const LabTestPrescription = require('../models/LabTestPrescription');

// Add New Lab Test
exports.addLabTest = async (req, res) => {
  try {
    const labTestData = req.body;
    const labTest = new LabTest(labTestData);
    await labTest.save();
    res.status(201).json({ message: 'Lab test added successfully', labTest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Lab Test Details
exports.updateLabTest = async (req, res) => {
  try {
    const { labTestId } = req.params;
    const updateData = req.body;
    
    const labTest = await LabTest.findByIdAndUpdate(labTestId, updateData, { new: true });
    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    
    res.json({ message: 'Lab test updated successfully', labTest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Test by ID
exports.getLabTestById = async (req, res) => {
  try {
    const { labTestId } = req.params;
    const labTest = await LabTest.findById(labTestId);
    
    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    
    res.json(labTest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Lab Tests
exports.listAllLabTests = async (req, res) => {
  try {
    const labTests = await LabTest.find({ isActive: true });
    res.json(labTests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Lab Test
exports.deactivateLabTest = async (req, res) => {
  try {
    const { labTestId } = req.params;
    const labTest = await LabTest.findById(labTestId);
    
    if (!labTest) {
      return res.status(404).json({ message: 'Lab test not found' });
    }
    
    labTest.isActive = false;
    await labTest.save();
    
    res.json({ message: 'Lab test deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create Lab Test Prescription
exports.createLabTestPrescription = async (req, res) => {
  try {
    const prescriptionData = req.body;
    const prescription = new LabTestPrescription(prescriptionData);
    await prescription.save();
    res.status(201).json({ message: 'Lab test prescription created successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Lab Test Prescription
exports.updateLabTestPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;
    
    const prescription = await LabTestPrescription.findByIdAndUpdate(prescriptionId, updateData, { new: true });
    if (!prescription) {
      return res.status(404).json({ message: 'Lab test prescription not found' });
    }
    
    res.json({ message: 'Lab test prescription updated successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Test Prescription by Appointment ID
exports.getLabTestPrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescriptions = await LabTestPrescription.find({ appointment: appointmentId })
      .populate('labTest')
      .populate('doctor.user', '-password')
      .populate('patient');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Lab Test Prescriptions by Patient
exports.listLabTestPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await LabTestPrescription.find({ 
      patient: patientId, 
      isActive: true 
    }).populate('labTest').populate('doctor.user', '-password');
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Record Lab Test Result
exports.recordLabTestResult = async (req, res) => {
  try {
    const { labTestPrescriptionId } = req.params;
    const { results } = req.body;
    
    const prescription = await LabTestPrescription.findById(labTestPrescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Lab test prescription not found' });
    }
    
    prescription.results = results;
    prescription.resultDate = new Date();
    await prescription.save();
    
    res.json({ message: 'Lab test result recorded successfully', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Test Result by Appointment ID
exports.getLabTestResultByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const results = await LabTestPrescription.find({ appointment: appointmentId })
      .populate('labTest')
      .populate('doctor.user', '-password')
      .populate('patient');
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List Lab Test Results by Date Range
exports.listLabTestResultsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    
    const results = await LabTestPrescription.find({
      resultDate: { $gte: start, $lt: end },
      isActive: true
    }).populate('labTest').populate('patient').populate('doctor.user', '-password');
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Lab Test Prescription
exports.deactivateLabTestPrescription = async (req, res) => {
  try {
    const { labTestPrescriptionId } = req.params;
    const prescription = await LabTestPrescription.findById(labTestPrescriptionId);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Lab test prescription not found' });
    }
    
    prescription.isActive = false;
    await prescription.save();
    
    res.json({ message: 'Lab test prescription deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 