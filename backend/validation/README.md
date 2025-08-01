# Validation System

This folder contains all validation utilities for the Clinic Management System, organized into logical modules for better maintainability.

## Structure

```
validation/
├── index.js           # Main entry point - exports all validation utilities
├── fieldValidation.js # Field-level validation functions
├── errorHandling.js   # Error response utilities
├── schemas.js         # Complex validation schemas
└── README.md         # This documentation
```

## Usage

### Import Validation Utilities

```javascript
const { 
  validateRequiredFields, 
  validateObjectId, 
  createValidationError,
  validateMedicinePrescriptionData,
  validateLabTestPrescriptionData,
  validateUserData
} = require('../validation');
```

## Field Validation (`fieldValidation.js`)

### Basic Field Validation

```javascript
// Validate required fields
const missingFields = validateRequiredFields(data, ['name', 'email', 'role']);
if (missingFields.length > 0) {
  return createValidationError(res, 'Missing required fields', missingFields);
}

// Validate ObjectId
const error = validateObjectId(id, 'User ID');
if (error) {
  return createValidationError(res, error);
}

// Validate email
const emailError = validateEmail(email);
if (emailError) {
  return createValidationError(res, emailError);
}

// Validate phone
const phoneError = validatePhone(phone);
if (phoneError) {
  return createValidationError(res, phoneError);
}

// Validate string length
const lengthError = validateStringLength(name, 2, 100, 'Name');
if (lengthError) {
  return createValidationError(res, lengthError);
}
```

## Error Handling (`errorHandling.js`)

### Error Response Utilities

```javascript
// Validation errors (400)
createValidationError(res, 'Validation failed', details);

// Not found errors (404)
createNotFoundError(res, 'Prescription');

// Unauthorized errors (401)
createUnauthorizedError(res, 'Invalid token');

// Forbidden errors (403)
createForbiddenError(res, 'Insufficient permissions');

// Server errors (500)
createServerError(res, error);

// Custom errors
createCustomError(res, 422, 'Unprocessable entity', details);
```

## Validation Schemas (`schemas.js`)

### Complex Validation Schemas

```javascript
// Medicine prescription validation
const errors = validateMedicinePrescriptionData(prescriptionData);
if (errors) {
  return createValidationError(res, 'Validation failed', errors);
}

// Lab test prescription validation
const errors = validateLabTestPrescriptionData(prescriptionData);
if (errors) {
  return createValidationError(res, 'Validation failed', errors);
}

// User data validation
const errors = validateUserData(userData);
if (errors) {
  return createValidationError(res, 'Validation failed', errors);
}
```

## Validation Features

### ✅ Field Validation
- Required field checking
- ObjectId format validation
- Email format validation
- Phone number validation
- String length validation
- Date format validation

### ✅ Error Handling
- Structured error responses
- Proper HTTP status codes
- Detailed error messages
- Field-specific error details

### ✅ Validation Schemas
- Complex data structure validation
- Reusable validation patterns
- Business logic validation
- Nested validation support

### ✅ Extensibility
- Easy to add new validation functions
- Modular design
- Clear separation of concerns
- Consistent API

## Example Usage in Controllers

```javascript
// Create Medicine Prescription
exports.createMedicinePrescription = async (req, res) => {
  try {
    const prescriptionData = req.body;
    
    // Use validation schema
    const validationErrors = validateMedicinePrescriptionData(prescriptionData);
    if (validationErrors) {
      return createValidationError(res, 'Validation failed', validationErrors);
    }

    // Continue with business logic...
    const prescription = new MedicinePrescription(prescriptionData);
    await prescription.save();
    
    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (err) {
    return createServerError(res, err);
  }
};
```

## Error Response Format

```json
{
  "message": "Validation failed",
  "details": {
    "missingFields": ["consultation", "doctor"],
    "email": "Email format is invalid",
    "name": "Name must be at least 2 characters long"
  }
}
```

## Benefits

1. **Centralized Validation**: All validation logic in one place
2. **Reusable**: Validation functions can be used across controllers
3. **Consistent**: Standardized error responses
4. **Maintainable**: Easy to update and extend
5. **Type Safe**: Clear validation rules and error messages
6. **Performance**: Efficient validation with early returns 