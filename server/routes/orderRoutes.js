import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import sendEmail from "../utils/sendEmail.js";
import { shippingNotificationTemplate } from "../utils/emailTemplates.js";

const router = express.Router();

// Create order
router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `${item.name} no longer exists`,
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} only has ${product.countInStock} left in stock`,
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged-in user's orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: get all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: UPDATE ORDER TRACKING
router.put("/:id/tracking", protect, adminOnly, async (req, res) => {
  try {
    const { shippingCarrier, trackingNumber, trackingUrl } = req.body;

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const hadTrackingBefore = Boolean(order.trackingNumber);

    order.shippingCarrier = shippingCarrier || "";
    order.trackingNumber = trackingNumber || "";
    order.trackingUrl = trackingUrl || "";

    if (trackingNumber) {
      order.status = "Shipped";
      order.shippedAt = order.shippedAt || new Date();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);

    const shouldSendShippingEmail =
      !hadTrackingBefore &&
      Boolean(updatedOrder.trackingNumber) &&
      updatedOrder.user?.email;

    if (shouldSendShippingEmail) {
      sendEmail({
        to: updatedOrder.user.email,
        subject: `Your order #${updatedOrder._id
          .toString()
          .slice(-6)
          .toUpperCase()} has shipped`,
        html: shippingNotificationTemplate(updatedOrder),
      }).catch((emailError) => {
        console.error("Shipping email failed:", emailError.message);
      });
    }
  } catch (error) {
    console.error("Tracking update error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: UPDATE ORDER STATUS
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "Shipped") {
      order.shippedAt = order.shippedAt || new Date();
    }

    if (status === "Delivered") {
      order.deliveredAt = order.deliveredAt || new Date();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE ORDER
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
