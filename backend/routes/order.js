const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Place order (student)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, total } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const order = await Order.create({
      student: req.user._id,
      items,
      total
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all orders
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }).populate("student", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student: get their own orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update order status
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
