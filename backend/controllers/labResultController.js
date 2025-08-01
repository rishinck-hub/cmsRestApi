const LabResult = require('../models/LabResult');
const LabTest = require('../models/LabTest');

// Create Lab Result
exports.createLabResult = async (req, res) => {
  try {
    const labResultData = req.body;
    const labResult = new LabResult(labResultData);
    await labResult.save();
    res.status(201).json({ message: 'Lab result created successfully', labResult });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Lab Result
exports.updateLabResult = async (req, res) => {
  try {
    const { labResultId } = req.params;
    const updateData = req.body;
    
    const labResult = await LabResult.findByIdAndUpdate(labResultId, updateData, { new: true });
    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found' });
    }
    
    res.json({ message: 'Lab result updated successfully', labResult });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Result by ID
exports.getLabResultById = async (req, res) => {
  try {
    const { labResultId } = req.params;
    const labResult = await LabResult.findById(labResultId)
      .populate('patient', '-password')
      .populate('doctor', '-password')
      .populate('labTest')
      .populate('appointment')
      .populate('labTechnician', '-password');
    
    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found' });
    }
    
    res.json(labResult);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Results by Appointment ID
exports.getLabResultsByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const labResults = await LabResult.find({ appointment: appointmentId })
      .populate('patient', '-password')
      .populate('doctor', '-password')
      .populate('labTest')
      .populate('labTechnician', '-password');
    
    res.json(labResults);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Results by Patient ID
exports.getLabResultsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const labResults = await LabResult.find({ 
      patient: patientId, 
      isActive: true 
    })
      .populate('doctor', '-password')
      .populate('labTest')
      .populate('appointment')
      .populate('labTechnician', '-password');
    
    res.json(labResults);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Lab Results
exports.listAllLabResults = async (req, res) => {
  try {
    const labResults = await LabResult.find({ isActive: true })
      .populate('patient', '-password')
      .populate('doctor', '-password')
      .populate('labTest')
      .populate('appointment')
      .populate('labTechnician', '-password');
    
    res.json(labResults);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Record Lab Test Result (for Lab Technician)
exports.recordLabTestResult = async (req, res) => {
  try {
    const { labResultId } = req.params;
    const { results, notes } = req.body;
    
    const labResult = await LabResult.findById(labResultId);
    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found' });
    }
    
    labResult.results = results;
    labResult.notes = notes;
    labResult.resultDate = new Date();
    labResult.status = 'completed';
    labResult.labTechnician = req.user.id;
    await labResult.save();
    
    res.json({ message: 'Lab test result recorded successfully', labResult });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Lab Results by Date Range
exports.getLabResultsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    
    const labResults = await LabResult.find({
      resultDate: { $gte: start, $lt: end },
      isActive: true
    })
      .populate('patient', '-password')
      .populate('doctor', '-password')
      .populate('labTest')
      .populate('appointment')
      .populate('labTechnician', '-password');
    
    res.json(labResults);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Lab Result
exports.deactivateLabResult = async (req, res) => {
  try {
    const { labResultId } = req.params;
    const labResult = await LabResult.findById(labResultId);
    
    if (!labResult) {
      return res.status(404).json({ message: 'Lab result not found' });
    }
    
    labResult.isActive = false;
    await labResult.save();
    
    res.json({ message: 'Lab result deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 