import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ActiveCoupons from "../components/ActiveCoupons";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-8 py-14 md:px-14 md:py-20 text-white shadow-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
            New arrivals
          </p>

          <h1 className="max-w-3xl text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Everyday style with a softer touch.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            Browse curated products, add your favorites to the cart, and check
            out securely when you are ready.
          </p>

          <ActiveCoupons />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Featured Products
            </h2>

            <p className="mt-2 text-slate-500">Fresh picks from the store</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full md:w-72 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
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
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-500">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700 border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-500">
              No products found. Try another search or category.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
