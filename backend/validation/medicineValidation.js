function medicineValidation(data) {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
    errors.name = 'Medicine name is required and must be at least 2 characters';
  }
  if (!data.manufacturer || typeof data.manufacturer !== 'string' || data.manufacturer.length < 2) {
    errors.manufacturer = 'Manufacturer is required and must be at least 2 characters';
  }
  if (!data.expiryDate || isNaN(Date.parse(data.expiryDate))) {
    errors.expiryDate = 'A valid expiry date is required';
  }
  if (typeof data.price !== 'number' || data.price < 0) {
    errors.price = 'Price must be a positive number';
  }
  if (typeof data.quantity !== 'number' || data.quantity < 0) {
    errors.quantity = 'Quantity must be a positive number';
  }
  if (typeof data.isActive !== 'boolean') {
    errors.isActive = 'isActive must be true or false';
  }

  return {
    error: Object.keys(errors).length > 0 ? { details: errors } : null
  };
}

module.exports = { medicineValidation };