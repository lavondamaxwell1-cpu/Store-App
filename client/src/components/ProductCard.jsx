import useCart from "../context/useCart";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="w-72 bg-white rounded-2xl shadow-lg overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold">{product.name}</h2>

        <p className="text-gray-500 text-sm mt-2">{product.description}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-green-600">
            ${product.price}
          </span>

          <button
            onClick={() => addToCart(product)}
            className="bg-blue-950 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-900"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
