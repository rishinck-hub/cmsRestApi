const jwt = require('jsonwebtoken');
const Staff=require("../models/Staff");
//to allow only authorized roles
exports.authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.roleId?.toLowerCase();
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles.map(r => r.toLowerCase()) : [allowedRoles.toLowerCase()];
    if (!rolesArray.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
    }

    next();
  };
};
//to allow if only token is entered
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const staff = await Staff.findOne({email:decoded.email});
    if (!staff) return res.status(401).json({ message: "Invalid token" });

    req.user = {
      id: staff._id,
      roleId: staff.roleId,
      email: staff.email,
      name: staff.name,
    };
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

