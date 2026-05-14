const ProductForm = ({
  formData,
  editingProductId,
  uploading,
  handleChange,
  handleImageUpload,
  handleSubmit,
  resetForm,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit"
    >
      <h2 className="text-2xl font-black text-slate-950">
        {editingProductId ? "Edit Product" : "Add Product"}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Upload a product image and enter the product details.
      </p>

      <div className="mt-6 space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
            required
          />

          <input
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            placeholder="Stock"
            type="number"
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
            required
          />
        </div>

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
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
          {editingProductId ? "Update Product" : "Create Product"}
        </button>

        {editingProductId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
