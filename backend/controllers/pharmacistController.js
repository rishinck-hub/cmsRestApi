const Medicine = require('../modules/Medicine');
const MedicineInventory = require('../models/MedicineInventory');

exports.addMedicine = async (req, res) => {
  const newMedicine = new Medicine(req.body);
  await newMedicine.save();
  res.status(201).json(newMedicine);
};

exports.updateMedicine = async (req, res) => {
  const updated = await Medicine.findByIdAndUpdate(req.params.medicineId, req.body, { new: true });
  res.json(updated);
};

exports.getMedicineById = async (req, res) => {
  const medicine = await Medicine.findById(req.params.medicineId);
  res.json(medicine);
};

exports.listAllMedicines = async (req, res) => {
  const list = await Medicine.find();
  res.json(list);
};

exports.deactivateMedicine = async (req, res) => {
  const updated = await Medicine.findByIdAndUpdate(req.params.medicineId, { isActive: false });
  res.json({ message: 'Medicine deactivated', updated });
};

exports.addInventoryItem = async (req, res) => {
  const newItem = new MedicineInventory(req.body);
  await newItem.save();
  res.status(201).json(newItem);
};

exports.updateInventory = async (req, res) => {
  const updated = await MedicineInventory.findByIdAndUpdate(req.params.medicineStockId, req.body, { new: true });
  res.json(updated);
};

exports.getInventoryByMedicine = async (req, res) => {
  const inventory = await MedicineInventory.find({ medicine: req.params.medicineId });
  res.json(inventory);
};

exports.listAllInventory = async (req, res) => {
  const list = await MedicineInventory.find();
  res.json(list);
};

exports.flagLowStock = async (req, res) => {
  const updated = await MedicineInventory.findByIdAndUpdate(req.params.medicineStockId, { flagLowStock: true });
  res.json({ message: 'Inventory flagged as low stock', updated });
};
