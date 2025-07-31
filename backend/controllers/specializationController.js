const Specialization = require('../models/Specialization');

// Add Specialization
exports.addSpecialization = async (req, res) => {
  try {
    const { name, description } = req.body;
    const specialization = new Specialization({ name, description });
    await specialization.save();
    res.status(201).json({ message: 'Specialization added successfully', specialization });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Specialization
exports.updateSpecialization = async (req, res) => {
  try {
    const { specializationId } = req.params;
    const { name, description } = req.body;
    
    const specialization = await Specialization.findById(specializationId);
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    if (name) specialization.name = name;
    if (description) specialization.description = description;
    await specialization.save();
    
    res.json({ message: 'Specialization updated successfully', specialization });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Specialization by ID
exports.getSpecializationById = async (req, res) => {
  try {
    const { specializationId } = req.params;
    const specialization = await Specialization.findById(specializationId);
    
    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    res.json(specialization);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Specializations
exports.listAllSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true });
    res.json(specializations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 