const Staff = require('../models/Staff');
const User = require('../models/User');
const { generateId } = require('../utils/counter');

// Create Staff
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role, department, position, salary } = req.body;
    
    // Create user first
    const user = new User({ name, email, password, role });
    await user.save();
    
    // Generate employee ID
    const employeeId = await generateId('EMP', 'staff');
    
    // Create staff profile
    const staff = new Staff({
      user: user._id,
      employeeId,
      department,
      position,
      salary
    });
    await staff.save();
    
    res.status(201).json({ message: 'Staff created successfully', staff });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Staff
exports.updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { name, email, department, position, salary } = req.body;
    
    const staff = await Staff.findById(staffId).populate('user');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Update user info
    if (name) staff.user.name = name;
    if (email) staff.user.email = email;
    await staff.user.save();
    
    // Update staff info
    if (department) staff.department = department;
    if (position) staff.position = position;
    if (salary) staff.salary = salary;
    await staff.save();
    
    res.json({ message: 'Staff updated successfully', staff });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await Staff.findById(staffId).populate('user', '-password');
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Staff
exports.listAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).populate('user', '-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Staff
exports.deactivateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await Staff.findById(staffId);
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    staff.isActive = false;
    await staff.save();
    
    // Also deactivate the user
    await User.findByIdAndUpdate(staff.user, { isActive: false });
    
    res.json({ message: 'Staff deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 