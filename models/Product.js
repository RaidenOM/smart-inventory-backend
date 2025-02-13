const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  minStockThreshold: { type: Number, default: 10 },
});

module.exports = mongoose.model("Product", productSchema);
