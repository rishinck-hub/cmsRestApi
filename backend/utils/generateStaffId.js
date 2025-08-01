const Staff = require("../models/Staff");

const getRolePrefix = {
  1: 'ADM', // Admin
  2: 'DOC', // Doctor
  3: 'REC', // Receptionist
  4: 'PHA', // Pharmacist
  5: 'LAB', // LabTech
};

const generateStaffId = async function (roleId) {
  const prefix = getRolePrefix[roleId] || 'STF';

  // Find the last staff with this prefix
  const lastStaff = await Staff.findOne({ staffId: new RegExp(`^${prefix}`) })
    .sort({ staffId: -1 }) // Descending order
    .collation({ locale: 'en', numericOrdering: true });

  let nextNumber = 1;

  if (lastStaff) {
    const lastNumber = parseInt(lastStaff.staffId.replace(prefix, '')) || 0;
    nextNumber = lastNumber + 1;
  }

  const idNumber = nextNumber.toString().padStart(3, "0");
  return `${prefix}${idNumber}`;
};

module.exports = generateStaffId;
