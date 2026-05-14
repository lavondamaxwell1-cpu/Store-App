import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let ignore = false;

    api
      .get("/products")
      .then(({ data }) => {
        if (!ignore) {
          setProducts(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load products.");
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

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const filteredProducts = products
    .filter((product) => {
      const productName = product.name || "";
      const productDescription = product.description || "";
      const productCategory = product.category || "";

      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || productCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name-az") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "stock-low") {
        return a.countInStock - b.countInStock;
      }

      if (sortBy === "stock-high") {
        return b.countInStock - a.countInStock;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const getStockBadge = (countInStock) => {
    if (countInStock <= 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-50 text-red-600",
      };
    }

    if (countInStock <= 5) {
      return {
        label: "Low Stock",
        className: "bg-yellow-50 text-yellow-700",
      };
    }

    return {
      label: "In Stock",
      className: "bg-emerald-50 text-emerald-700",
    };
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/products/${id}`);

      setProducts((prev) => prev.filter((product) => product._id !== id));
      setSuccess("Product deleted successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Products
            </h1>

            <p className="mt-2 text-slate-500">
              View, search, filter, edit, and manage all products in your store.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Add Product
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Product List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading products..."
                  : `Showing ${filteredProducts.length} of ${
                      products.length
                    } product${products.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition md:w-72"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              >
                <option value="newest">Newest First</option>
                <option value="name-az">Name A-Z</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="stock-low">Stock Low to High</option>
                <option value="stock-high">Stock High to Low</option>
              </select>
              {(searchTerm ||
                selectedCategory !== "All" ||
                sortBy !== "newest") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSortBy("newest");
                  }}
                  className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">
              No products found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const stockBadge = getStockBadge(product.countInStock);

                return (
                  <div
                    key={product._id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-28 w-full rounded-2xl bg-white object-cover md:w-28"
                      />

                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {product.category}
                        </p>

                        <h3 className="mt-1 text-lg font-black text-slate-950">
                          {product.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {product.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-950">
                            ${product.price}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 font-bold ${stockBadge.className}`}
                          >
                            {stockBadge.label}: {product.countInStock}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product._id)}
                          className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
