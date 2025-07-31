const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
<<<<<<< HEAD
      return res.status(401).json({ message: 'Access denied. User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

=======
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
>>>>>>> development
    next();
  };
};

module.exports = authorize; 