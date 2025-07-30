const Medicine = require('../models/Medicine');

// Add New Medicine
exports.addMedicine = async (req, res) => {
  try {
    const medicineData = req.body;
    const medicine = new Medicine(medicineData);
    await medicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Medicine Details
exports.updateMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const updateData = req.body;
    
    const medicine = await Medicine.findByIdAndUpdate(medicineId, updateData, { new: true });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const medicine = await Medicine.findById(medicineId);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Medicines
exports.listAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isActive: true });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Medicine
exports.deactivateMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const medicine = await Medicine.findById(medicineId);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    medicine.isActive = false;
    await medicine.save();
    
    res.json({ message: 'Medicine deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 