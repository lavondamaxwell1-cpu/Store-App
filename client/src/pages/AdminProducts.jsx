import { useEffect, useState } from "react";
import api from "../services/api";
import useAuth from "../context/useAuth";

const AdminProducts = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      });

    return () => {
      ignore = true;
    };
  }, []);

  const reloadProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };
const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};
  // createProduct goes under here
  const createProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post(
        "/products",
        {
          ...formData,
          price: Number(formData.price),
          countInStock: Number(formData.countInStock),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setSuccess("Product created successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        countInStock: "",
      });
      await reloadProducts();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create product.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      await reloadProducts();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-blue-950 mb-8">Admin Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={createProduct}
          className="bg-white p-6 rounded-2xl shadow space-y-4 h-fit"
        >
          <h2 className="text-2xl font-bold text-blue-950">Add Product</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-xl">
              {success}
            </div>
          )}

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-3 rounded-xl"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            placeholder="Count In Stock"
            type="number"
            className="w-full border p-3 rounded-xl"
            required
          />

          <button className="w-full bg-blue-950 text-white py-3 rounded-xl hover:bg-blue-900">
            Create Product
          </button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-blue-950 mb-4">Products</h2>

          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 border-b pb-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${product.price} • {product.category} • Stock:{" "}
                    {product.countInStock}
                  </p>
                </div>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}

            {products.length === 0 && (
              <p className="text-gray-500">No products yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
