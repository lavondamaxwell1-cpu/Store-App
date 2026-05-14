import express from "express";
import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE STRIPE CHECKOUT SESSION
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { cartItems, shippingAddress, couponCode } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No cart items" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const orderItems = [];
    const lineItems = [];

    let subtotalPrice = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item._id || item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      const quantity = Number(item.quantity);
      const price = Number(product.price);

      subtotalPrice += price * quantity;

      orderItems.push({
        name: product.name,
        quantity,
        image: product.image,
        price,
        product: product._id,
      });

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      });
    }

    let discountAmount = 0;
    let appliedCouponCode = "";

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon code" });
      }

      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }

      if (coupon.discountType === "percentage") {
        discountAmount = subtotalPrice * (coupon.discountValue / 100);
      } else {
        discountAmount = coupon.discountValue;
      }

      discountAmount = Math.min(discountAmount, subtotalPrice);
      appliedCouponCode = coupon.code;
    }

    const totalPrice = Math.max(subtotalPrice - discountAmount, 0);

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      subtotalPrice,
      discountAmount,
      couponCode: appliedCouponCode,
      totalPrice,
      status: "Pending",
      isPaid: false,
    });

    let discounts = [];

    if (discountAmount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "usd",
        duration: "once",
        name: appliedCouponCode || "Store Discount",
      });

      discounts = [
        {
          coupon: stripeCoupon.id,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      discounts,
      success_url: `${process.env.CLIENT_URL}/order-success/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
        couponCode: appliedCouponCode,
        discountAmount: discountAmount.toString(),
      },
    });

    res.json({
      id: session.id,
      url: session.url,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// STRIPE WEBHOOK
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const order = await Order.findById(session.metadata.orderId);

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.status = "Paid";
        order.paidAt = new Date();

        await order.save();

        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: {
              countInStock: -item.quantity,
            },
          });
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
