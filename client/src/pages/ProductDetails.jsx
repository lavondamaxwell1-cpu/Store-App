import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { fallbackImage } from "../utils/fallbackImage";

const RatingStars = ({ rating = 0 }) => {
  const roundedRating = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= roundedRating ? "text-yellow-400" : "text-slate-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const fetchProduct = async () => {
    const { data } = await api.get(`/products/${id}`);
    setProduct(data);
  };

  useEffect(() => {
    let ignore = false;

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (!ignore) {
          setProduct(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load product.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleReviewChange = (e) => {
    setReviewData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.comment.trim()) {
      toast.error("Please write a review comment.");
      return;
    }

    try {
      setReviewLoading(true);

      await api.put(`/products/${id}/reviews`, {
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      });

      toast.success("Review added!");

      setReviewData({
        rating: 5,
        comment: "",
      });

      await fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review.");
    } finally {
      setReviewLoading(false);
    }
  };
const addToWishlist = async () => {
  if (!user) {
    toast.error("Please login to save this product.");
    return;
  }

  try {
    await api.post(`/auth/wishlist/${product._id}`);
    toast.success("Added to wishlist");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to add to wishlist.");
  }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-7xl mx-auto rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-7xl mx-auto rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const isOutOfStock = product.countInStock === 0;

  const alreadyReviewed = product.reviews?.some(
    (review) => review.user === user?._id,
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="mb-6 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
        >
          ← Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img
              src={product.image || fallbackImage}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className="h-[420px] md:h-[620px] w-full object-cover"
            />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm h-fit">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RatingStars rating={product.rating} />

              <p className="text-sm font-semibold text-slate-500">
                {product.numReviews || 0} review
                {product.numReviews === 1 ? "" : "s"}
              </p>
            </div>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-5 py-3 text-2xl font-black text-slate-950">
                ${product.price}
              </span>

              <span
                className={`rounded-full px-5 py-3 text-sm font-bold ${
                  isOutOfStock
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${product.countInStock} in stock`}
              </span>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-700">
                Secure checkout
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Add this product to your cart and continue to Stripe checkout
                when you are ready.
              </p>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className="mt-8 w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={addToWishlist}
              className="mt-3 w-full rounded-full bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Add to Wishlist
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black text-slate-950">
              Customer Reviews
            </h2>

            <p className="mt-2 text-slate-500">
              See what customers are saying about this product.
            </p>

            {product.reviews?.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-slate-500">
                No reviews yet. Be the first to review this product.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {product.reviews.map((review) => (
                  <div key={review._id} className="rounded-3xl bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-black text-slate-950">
                          {review.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <RatingStars rating={review.rating} />
                    </div>

                    <p className="mt-4 leading-7 text-slate-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="text-2xl font-black text-slate-950">
              Write a Review
            </h2>

            {!user ? (
              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm leading-6 text-slate-500">
                  Please login to leave a review.
                </p>

                <Link
                  to="/login"
                  className="mt-4 inline-block rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                >
                  Login
                </Link>
              </div>
            ) : alreadyReviewed ? (
              <div className="mt-5 rounded-3xl bg-emerald-50 p-5 text-emerald-700">
                You already reviewed this product.
              </div>
            ) : (
              <form onSubmit={submitReview} className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Rating
                  </label>

                  <select
                    name="rating"
                    value={reviewData.rating}
                    onChange={handleReviewChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Comment
                  </label>

                  <textarea
                    name="comment"
                    value={reviewData.comment}
                    onChange={handleReviewChange}
                    placeholder="Share your thoughts..."
                    rows="5"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
