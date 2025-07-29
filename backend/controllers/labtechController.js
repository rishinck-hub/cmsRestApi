const LabTest = require('../models/LabTest');
const LabTestResult = require('../models/LabTestResult');

exports.addLabTest = async (req, res) => {
  const newTest = new LabTest(req.body);
  await newTest.save();
  res.status(201).json(newTest);
};

exports.updateLabTest = async (req, res) => {
  const updated = await LabTest.findByIdAndUpdate(req.params.labTestId, req.body, { new: true });
  res.json(updated);
};

exports.getLabTestById = async (req, res) => {
  const test = await LabTest.findById(req.params.labTestId);
  res.json(test);
};

exports.listAllLabTests = async (req, res) => {
  const list = await LabTest.find();
  res.json(list);
};

exports.deactivateLabTest = async (req, res) => {
  const updated = await LabTest.findByIdAndUpdate(req.params.labTestId, { isActive: false });
  res.json({ message: 'Lab test deactivated', updated });
};

exports.recordLabResult = async (req, res) => {
  const result = new LabTestResult({
    labTestPrescriptionId: req.params.labTestPrescriptionId,
    resultData: req.body.resultData
  });
  await result.save();
  res.status(201).json(result);
};

exports.getResultByAppointment = async (req, res) => {
  const result = await LabTestResult.findOne({ appointmentId: req.params.appointmentId });
  res.json(result);
};

exports.listResultsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  const results = await LabTestResult.find({
    recordedAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
  });
  res.json(results);
};

exports.deactivateLabPrescription = async (req, res) => {
  res.json({ message: 'Lab test prescription deactivation not implemented yet' });
};
