const labTestResultSchema = new mongoose.Schema({
  labTestPrescriptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  resultData: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LabTestResult', labTestResultSchema);
