import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedOrigin = allowedOrigins.includes(origin);
      const isVercelPreview = origin.endsWith(".vercel.app");

      if (isAllowedOrigin || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

// Stripe webhook needs raw body BEFORE express.json()
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);

// app.get("/api/test-email", async (req, res) => {
//   try {
//     await sendEmail({
//       to: "lavondamaxwell1@gmail.com",
//       subject: "Lavonda Store Email Test",
//       html: `
//         <h1>Email is working 🎉</h1>
//         <p>This is a test email from your deployed store backend.</p>
//       `,
//     });

//     res.json({ message: "Test email sent" });
//   } catch (error) {
//     console.error("Test email failed:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Store API is running");
// });

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
