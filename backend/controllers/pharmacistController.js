// controllers/pharmacistController.js

// --- Medicine Management ---
exports.addMedicine = (req, res) => {
  // Add new medicine logic here
  res.status(201).json({ message: "Medicine added successfully" });
};

exports.updateMedicine = (req, res) => {
  const { medicineId } = req.params;
  // Update medicine logic here
  res.json({ message: `Medicine ${medicineId} updated` });
};

exports.getMedicineById = (req, res) => {
  const { medicineId } = req.params;
  // Fetch medicine by ID logic
  res.json({ id: medicineId, name: "Sample Medicine" });
};

exports.listAllMedicines = (req, res) => {
  // List all medicines
  res.json([{ id: 1, name: "Medicine A" }, { id: 2, name: "Medicine B" }]);
};

exports.deactivateMedicine = (req, res) => {
  const { medicineId } = req.params;
  // Deactivate logic
  res.json({ message: `Medicine ${medicineId} deactivated` });
};

// --- Inventory Management ---
exports.addInventoryItem = (req, res) => {
  // Add inventory logic
  res.status(201).json({ message: "Inventory item added" });
};

exports.updateInventory = (req, res) => {
  const { medicineStockId } = req.params;
  // Update stock logic
  res.json({ message: `Inventory ${medicineStockId} updated` });
};

exports.getInventoryByMedicine = (req, res) => {
  const { medicineId } = req.params;
  // Get inventory for medicine
  res.json({ medicineId, stock: 100 });
};

exports.listAllInventory = (req, res) => {
  // List all inventory items
  res.json([{ stockId: 1, qty: 20 }, { stockId: 2, qty: 5 }]);
};

exports.flagLowStock = (req, res) => {
  const { medicineStockId } = req.params;
  // Flag low stock
  res.json({ message: `Inventory ${medicineStockId} flagged as low` });
};
