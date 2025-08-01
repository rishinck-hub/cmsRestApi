const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, required: true, default: 10 },
  isLowStock: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema); 