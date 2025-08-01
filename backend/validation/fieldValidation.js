const mongoose = require('mongoose');

// Validate required fields in request body
exports.validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  for (const field of requiredFields) {
    if (!data[field]) {
      missingFields.push(field);
    }
  }
  return missingFields;
};

// Validate ObjectId format
exports.validateObjectId = (id, fieldName = 'ID') => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return `${fieldName} is invalid`;
  }
  return null;
};

// Validate multiple ObjectIds
exports.validateObjectIds = (ids, fieldNames) => {
  const errors = {};
  for (let i = 0; i < ids.length; i++) {
    const error = this.validateObjectId(ids[i], fieldNames[i]);
    if (error) {
      errors[fieldNames[i]] = error;
    }
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

// Validate email format
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Email format is invalid';
  }
  return null;
};

// Validate phone number format
exports.validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Phone number format is invalid';
  }
  return null;
};

// Validate date format
exports.validateDate = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Date format is invalid';
  }
  return null;
};

// Validate string length
exports.validateStringLength = (str, minLength = 1, maxLength = 255, fieldName = 'Field') => {
  if (!str || str.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  if (str.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return null;
}; 