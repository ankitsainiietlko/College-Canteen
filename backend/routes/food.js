const express = require("express");
const router = express.Router();
const Food = require("../models/FoodItem.js");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Get all food items
router.get("/", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// Admin: add food
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, price, image } = req.body;
  const food = await Food.create({ name, description, price, image });
  res.json(food);
});

// Admin: update food
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const updated = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Admin: delete food
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Food deleted" });
});

module.exports = router;
