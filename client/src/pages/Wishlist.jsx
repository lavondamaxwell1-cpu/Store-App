import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { fallbackImage } from "../utils/fallbackImage";
import { useCart } from "../context/useCart";

const Wishlist = () => {
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    const { data } = await api.get("/auth/wishlist");
    setWishlist(data);
  };

  useEffect(() => {
    let ignore = false;

    api
      .get("/auth/wishlist")
      .then(({ data }) => {
        if (!ignore) {
          setWishlist(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load wishlist.");
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

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingId(productId);

      await api.delete(`/auth/wishlist/${productId}`);

      toast.success("Removed from wishlist");

      await fetchWishlist();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product.");
    } finally {
      setRemovingId("");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              My Account
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              My Wishlist
            </h1>

            <p className="mt-2 text-slate-500">Products you saved for later.</p>
          </div>

          <Link
            to="/"
            className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image || fallbackImage}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="h-72 w-full object-cover"
                  />
                </Link>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {product.category}
                  </p>

                  <Link to={`/product/${product._id}`}>
                    <h2 className="mt-2 text-xl font-black text-slate-950 hover:underline">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-lg font-black text-slate-950">
                      ${product.price}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        product.countInStock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock <= 0}
                      className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product._id)}
                      disabled={removingId === product._id}
                      className="rounded-full bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60 transition"
                    >
                      {removingId === product._id
                        ? "Removing..."
                        : "Remove from Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
