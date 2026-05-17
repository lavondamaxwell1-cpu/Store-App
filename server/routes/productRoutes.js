import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// ADMIN: GET ALL REVIEWS
router.get("/admin/reviews", protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({
      "reviews.0": { $exists: true },
    }).select("name image category rating numReviews reviews");

    const reviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        reviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          productImage: product.image,
          productCategory: product.category,
          productRating: product.rating,
          productNumReviews: product.numReviews,
          user: review.user,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: DELETE REVIEW
router.delete(
  "/:productId/reviews/:reviewId",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const reviewExists = product.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );

      if (!reviewExists) {
        return res.status(404).json({ message: "Review not found" });
      }

      product.reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.params.reviewId
      );

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.length === 0
          ? 0
          : product.reviews.reduce(
              (total, review) => total + Number(review.rating),
              0
            ) / product.reviews.length;

      await product.save();

      res.json({ message: "Review deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

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

router.put("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((total, review) => total + review.rating, 0) /
      product.reviews.length;

    const updatedProduct = await product.save();

    res.status(201).json({
      message: "Review added",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
