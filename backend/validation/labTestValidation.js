function labTestValidation(data) {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
    errors.name = 'Lab test name is required and must be at least 2 characters';
  }
  if (data.description && typeof data.description !== 'string') {
    errors.description = 'Description must be a string';
  }
  if (typeof data.price !== 'number' || data.price < 0) {
    errors.price = 'Price must be a positive number';
  }
  if (typeof data.isActive !== 'boolean' && typeof data.isActive !== 'undefined') {
    errors.isActive = 'isActive must be true or false';
  }

  return {
    error: Object.keys(errors).length > 0 ? { details: errors } : null
  };
}

module.exports = { labTestValidation };