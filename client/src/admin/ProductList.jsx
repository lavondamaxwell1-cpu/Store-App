const ProductList = ({ products, startEdit, deleteProduct }) => {
  return (
    <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Product List</h2>

          <p className="mt-1 text-sm text-slate-500">
            {products.length} product{products.length === 1 ? "" : "s"} in your
            store
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">
          No products yet.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-full md:w-24 rounded-2xl object-cover bg-white"
                />

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {product.category}
                  </p>

                  <h3 className="mt-1 text-lg font-black text-slate-950">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-950">
                      ${product.price}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 font-bold ${
                        product.countInStock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      Stock: {product.countInStock}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
