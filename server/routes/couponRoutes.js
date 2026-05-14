import express from "express";
import Coupon from "../models/Coupon.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN: CREATE COUPON
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt } = req.body;

    if (!code || !discountValue) {
      return res
        .status(400)
        .json({ message: "Code and discount are required" });
    }

    const couponExists = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (couponExists) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || "percentage",
      discountValue: Number(discountValue),
      expiresAt: expiresAt || null,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: GET ALL COUPONS
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CUSTOMER: VALIDATE COUPON
router.post("/validate", protect, async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    const orderSubtotal = Number(subtotal || 0);

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = orderSubtotal * (coupon.discountValue / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderSubtotal);

    const totalAfterDiscount = Math.max(orderSubtotal - discountAmount, 0);

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      totalAfterDiscount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: TOGGLE ACTIVE
router.put("/:id/toggle", protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;

    const updatedCoupon = await coupon.save();

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CUSTOMER: GET ACTIVE COUPONS
router.get("/active", async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: DELETE COUPON
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await coupon.deleteOne();

    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
