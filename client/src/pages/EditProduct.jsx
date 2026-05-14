import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (!ignore) {
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            category: data.category,
            countInStock: data.countInStock,
          });
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

  const updateProduct = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      });

      navigate("/admin/products");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update product.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

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
            Edit Product
          </h1>

          <p className="mt-2 text-slate-500">
            Update product details, pricing, stock, or image.
          </p>

          {error && (
            <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={updateProduct} className="mt-6 space-y-4">
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
                <div className="mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-36 w-36 rounded-2xl object-cover bg-white"
                  />

                  <p className="mt-2 text-xs text-slate-400 break-all">
                    {formData.image}
                  </p>
                </div>
              )}
            </div>

            <button className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
