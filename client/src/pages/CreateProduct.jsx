import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: "",
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      setError("");

      const { data } = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      });

      navigate("/admin/products");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create product.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin/products"
          className="mb-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
        >
          ← Back to Products
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Add Product
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new product for your storefront.
          </p>

          {error && (
            <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={createProduct} className="mt-6 space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              />

              <input
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                placeholder="Stock"
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              />
            </div>

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              required
            />

            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-500"
              />

              {uploading && (
                <p className="mt-3 text-sm font-semibold text-blue-700">
                  Uploading image...
                </p>
              )}

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-4 h-36 w-36 rounded-2xl object-cover bg-white"
                />
              )}
            </div>

            <button className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
