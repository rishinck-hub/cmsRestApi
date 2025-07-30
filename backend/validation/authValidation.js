function registerValidation(data) {
  const errors = {};

  if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 255) {
    errors.name = 'Name must be a string between 3 and 255 characters';
  }
  if (!data.email || typeof data.email !== 'string' || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
    errors.email = 'A valid email is required';
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6 || data.password.length > 1024) {
    errors.password = 'Password must be between 6 and 1024 characters';
  }
  const validRoles = ['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist'];
  if (!data.role || !validRoles.includes(data.role)) {
    errors.role = 'Role must be one of: admin, doctor, nurse, pharmacist, receptionist';
  }

  return {
    error: Object.keys(errors).length > 0 ? { details: errors } : null
  };
}

function loginValidation(data) {
  const errors = {};

  if (!data.email || typeof data.email !== 'string' || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
    errors.email = 'A valid email is required';
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6 || data.password.length > 1024) {
    errors.password = 'Password must be between 6 and 1024 characters';
  }

  return {
    error: Object.keys(errors).length > 0 ? { details: errors } : null
  };
}

module.exports = { registerValidation, loginValidation };