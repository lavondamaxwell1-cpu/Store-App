import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      const base64Image = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "store-products",
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Image upload failed",
      });
    }
  },
);

export default router;
