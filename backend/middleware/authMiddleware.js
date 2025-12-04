const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if(!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch(err){
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only middleware
const adminMiddleware = (req, res, next) => {
  if(req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
  next();
};

module.exports = { authMiddleware, adminMiddleware };
