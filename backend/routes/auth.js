const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Signup
router.post("/signup", async (req, res) => {
  console.log("Incoming signup body:", req.body);

  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    res.json({ message: "User registered successfully" });
  } catch(err) {
    console.error("Signup Error:", err); // <--- PRINT FULL ERROR
    res.status(400).json({ message: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role, name: user.name });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
