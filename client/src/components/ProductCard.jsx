import { Link } from "react-router-dom";
import {useCart }from "../context/useCart";
import { fallbackImage } from "../utils/fallbackImage";
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="group w-full max-w-xs overflow-hidden rounded-3xl bg-white border border-slate-200/70 shadow-sm hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="bg-slate-100 overflow-hidden">
          <img
            src={product.image || fallbackImage}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {product.category}
            </p>

            <Link to={`/product/${product._id}`}>
              <h2 className="mt-1 text-lg font-bold text-slate-900 hover:text-blue-900 transition">
                {product.name}
              </h2>
            </Link>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-900">
            ${product.price}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">
          {product.description}
        </p>

        <p
          className={`mt-4 text-sm font-semibold ${
            isOutOfStock ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {isOutOfStock ? "Out of stock" : `${product.countInStock} in stock`}
        </p>

        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className="mt-4 w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
