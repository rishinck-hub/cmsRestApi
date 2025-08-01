const jwt = require("jsonwebtoken");

exports.generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
};
