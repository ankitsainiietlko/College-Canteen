const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Preparing", "Completed"], default: "Pending" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
