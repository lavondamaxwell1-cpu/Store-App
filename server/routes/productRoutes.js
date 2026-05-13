import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

router.post("/", protect, adminOnly, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(product);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
