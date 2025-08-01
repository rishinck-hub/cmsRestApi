// Create validation error response
exports.createValidationError = (res, message, details = null) => {
  const errorResponse = { message };
  if (details) {
    errorResponse.details = details;
  }
  return res.status(400).json(errorResponse);
};

// Create not found error response
exports.createNotFoundError = (res, resource = 'Resource') => {
  return res.status(404).json({ 
    message: `${resource} not found` 
  });
};

// Create unauthorized error response
exports.createUnauthorizedError = (res, message = 'Access denied') => {
  return res.status(401).json({ 
    message 
  });
};

// Create forbidden error response
exports.createForbiddenError = (res, message = 'Insufficient permissions') => {
  return res.status(403).json({ 
    message 
  });
};

// Create server error response
exports.createServerError = (res, error) => {
  return res.status(500).json({ 
    message: 'Server error', 
    error: error.message 
  });
};

// Create custom error response
exports.createCustomError = (res, statusCode, message, details = null) => {
  const errorResponse = { message };
  if (details) {
    errorResponse.details = details;
  }
  return res.status(statusCode).json(errorResponse);
}; 