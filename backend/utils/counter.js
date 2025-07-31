const mongoose = require('mongoose');

// Counter Schema for generating unique IDs
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Generate unique ID with prefix
const generateId = async (prefix, collectionName) => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      collectionName,
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );
    
    const paddedSequence = counter.sequence.toString().padStart(6, '0');
    return `${prefix}${paddedSequence}`;
  } catch (error) {
    throw new Error('Failed to generate ID');
  }
};

module.exports = {
  generateId
}; 