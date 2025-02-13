const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Sale = require("./models/Sale");

mongoose.connect("mongodb://127.0.0.1:27017/smart-inventory");
app.use(express.json());

// routes for product
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.json({ products: products });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.json({ product: product });
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ product: product });
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json({ updatedProduct: updatedProduct });
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.json({ deletedProduct: deletedProduct });
});

// sales route
app.get("/sales", async (req, res) => {
  const sales = await Sale.find({}).populate("productId");
  res.json({ sales: sales });
});

app.get("/sales/:productId", async (req, res) => {
  const { productId } = req.params;
  const sale = await Sale.find({ productId: productId }).populate("productId");
  res.json({ sale: sale });
});

app.post("/sales", async (req, res) => {
  const { productId, quantitySold } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not fount" });
  }

  if (product.currentStock < quantitySold) {
    return res.status(400).json({ error: "Not enough stock" });
  }

  const sale = new Sale({ productId: productId, quantitySold: quantitySold });
  await sale.save();

  product.currentStock -= quantitySold;
  await product.save();

  res.json({ sale, product });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
