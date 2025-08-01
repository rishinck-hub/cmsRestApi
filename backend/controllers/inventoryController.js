const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

// Add New Inventory Item
exports.addInventoryItem = async (req, res) => {
  try {
    const { medicine, quantity, reorderLevel } = req.body;
    
    // Check if medicine exists
    const medicineExists = await Medicine.findById(medicine);
    if (!medicineExists) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    // Check if inventory already exists for this medicine
    const existingInventory = await Inventory.findOne({ medicine });
    if (existingInventory) {
      return res.status(400).json({ message: 'Inventory already exists for this medicine' });
    }
    
    const inventory = new Inventory({ medicine, quantity, reorderLevel });
    await inventory.save();
    
    res.status(201).json({ message: 'Inventory item added successfully', inventory });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Inventory Quantity
exports.updateInventoryQuantity = async (req, res) => {
  try {
    const { medicineStockId } = req.params;
    const { quantity, reorderLevel } = req.body;
    
    const inventory = await Inventory.findById(medicineStockId);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    if (quantity !== undefined) inventory.quantity = quantity;
    if (reorderLevel !== undefined) inventory.reorderLevel = reorderLevel;
    
    // Check if stock is low
    inventory.isLowStock = inventory.quantity <= inventory.reorderLevel;
    
    await inventory.save();
    
    res.json({ message: 'Inventory quantity updated successfully', inventory });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Inventory by Medicine ID
exports.getInventoryByMedicineId = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const inventory = await Inventory.findOne({ medicine: medicineId }).populate('medicine');
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found for this medicine' });
    }
    
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Inventory Items
exports.listAllInventoryItems = async (req, res) => {
  try {
    const inventory = await Inventory.find({ isActive: true }).populate('medicine');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Flag Low Stock
exports.flagLowStock = async (req, res) => {
  try {
    const { medicineStockId } = req.params;
    const inventory = await Inventory.findById(medicineStockId);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    inventory.isLowStock = true;
    await inventory.save();
    
    res.json({ message: 'Low stock flagged successfully', inventory });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 