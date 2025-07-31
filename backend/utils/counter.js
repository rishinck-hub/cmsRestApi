const Counter = require('../models/Counter');

const getNextSequence = async (sequenceName) => {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
};

const generateId = async (prefix, sequenceName) => {
  const sequence = await getNextSequence(sequenceName);
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
};

module.exports = { getNextSequence, generateId }; 