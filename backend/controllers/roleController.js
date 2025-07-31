const Role = require('../models/Role');

// Create Role
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name, description });
    await role.save();
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, description } = req.body;
    
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    if (name) role.name = name;
    if (description) role.description = description;
    await role.save();
    
    res.json({ message: 'Role updated successfully', role });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await Role.findById(roleId);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List All Roles
exports.listAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Deactivate Role
exports.deactivateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await Role.findById(roleId);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    role.isActive = false;
    await role.save();
    
    res.json({ message: 'Role deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 