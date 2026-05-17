import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { fallbackImage } from "../utils/fallbackImage";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  const [selectedRating, setSelectedRating] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReviews = async () => {
    const { data } = await api.get("/products/admin/reviews");
    setReviews(data);
  };

  useEffect(() => {
    let ignore = false;

    api
      .get("/products/admin/reviews")
      .then(({ data }) => {
        if (!ignore) {
          setReviews(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load reviews.");
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
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      selectedRating === "All" ||
      Number(review.rating) === Number(selectedRating);

    return matchesSearch && matchesRating;
  });

  const deleteReview = async (productId, reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(reviewId);
      setError("");
      setSuccess("");

      await api.delete(`/products/${productId}/reviews/${reviewId}`);

      setSuccess("Review deleted successfully.");
      await fetchReviews();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingId("");
    }
  };

  const getRatingBadge = (rating) => {
    if (rating >= 4) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (rating === 3) {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-red-50 text-red-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Reviews
            </h1>

            <p className="mt-2 text-slate-500">
              Moderate customer reviews and remove anything that should not be
              public.
            </p>
          </div>

          <Link
            to="/admin"
            className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {(error || success) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-700">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Review List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading reviews..."
                  : `Showing ${filteredReviews.length} of ${reviews.length} review${
                      reviews.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviews..."
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition md:w-72"
              />

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {(searchTerm || selectedRating !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRating("All");
                  }}
                  className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            No reviews found.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img
                      src={review.productImage || fallbackImage}
                      alt={review.productName}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-24 w-full rounded-2xl object-cover bg-slate-50 sm:w-24"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {review.productCategory}
                      </p>

                      <Link to={`/product/${review.productId}`}>
                        <h3 className="mt-1 text-xl font-black text-slate-950 hover:underline">
                          {review.productName}
                        </h3>
                      </Link>

                      <p className="mt-2 text-sm text-slate-500">
                        Reviewed by{" "}
                        <span className="font-bold text-slate-700">
                          {review.name}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold ${getRatingBadge(
                        review.rating,
                      )}`}
                    >
                      {review.rating} ★
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteReview(review.productId, review._id)}
                      disabled={deletingId === review._id}
                      className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                    >
                      {deletingId === review._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                  <p className="leading-7 text-slate-600">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
