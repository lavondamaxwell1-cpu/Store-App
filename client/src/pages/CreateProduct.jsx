import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const categories = [
  "Clothing",
  "Shoes",
  "Accessories",
  "Beauty",
  "Home",
  "Electronics",
  "Food",
  "Other",
];

const CreateProduct = () => {
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Clothing",
    countInStock: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setSuccess("");

      const { data } = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));

      setSuccess("Image uploaded successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const createProduct = async (stayOnPage = false) => {
    if (!formData.image) {
      setError("Please upload a product image.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/products", {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      });

      if (stayOnPage) {
        setFormData(emptyForm);
        setSuccess("Product created. You can add another one.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/admin/products");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(false);
  };

  const handleSaveAndAddAnother = (e) => {
    e.preventDefault();
    createProduct(true);
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
            Create a new product for your storefront. Use Save & Add Another to
            quickly enter multiple products.
          </p>

          {(error || success) && (
            <div className="mt-6 space-y-3">
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Product Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description"
                rows="4"
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Price
                </label>

                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="29.99"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Stock
                </label>

                <input
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  placeholder="10"
                  type="number"
                  min="0"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-40 w-40 rounded-2xl object-cover bg-white"
                  />

                  <p className="mt-2 break-all text-xs text-slate-400">
                    {formData.image}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {saving ? "Creating..." : "Create Product"}
              </button>

              <button
                type="button"
                onClick={handleSaveAndAddAnother}
                disabled={saving || uploading}
                className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:bg-slate-200 disabled:cursor-not-allowed transition"
              >
                {saving ? "Saving..." : "Save & Add Another"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
