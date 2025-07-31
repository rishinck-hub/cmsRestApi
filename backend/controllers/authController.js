const jwt = require('jsonwebtoken');
const Staff=require("../models/Staff");
//to allow only authorized roles
exports.authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.roleId?.toString();

    // Ensure allowedRoles is always an array of strings
    const allowed = Array.isArray(allowedRoles)
      ? allowedRoles.map(r => r.toString())
      : [allowedRoles.toString()];

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
    }

    next();
  };
};

//to allow if only token is entered
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🛠 Check if it's hardcoded admin
    if (
      decoded.email === process.env.ADMIN_EMAIL &&
      decoded.roleId === process.env.ADMIN_ROLE_ID
    ) {
      req.user = {
        id: 'admin',
        roleId: process.env.ADMIN_ROLE_ID,
        email: process.env.ADMIN_EMAIL,
        name: 'Admin',
      };
      return next();
    }

    // 🧑‍⚕️ Otherwise, fetch real staff user
    const staff = await Staff.findOne({ email: decoded.email });

    if (!staff) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: staff._id,
      roleId: staff.roleId?.toString(),
      email: staff.email,
      name: staff.name,
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
