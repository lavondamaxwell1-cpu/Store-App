import useCart from "../context/useCart";
import { Link } from "react-router-dom";
const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-2xl shadow flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-gray-500">${item.price}</p>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 text-sm mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="bg-gray-200 px-3 py-1 rounded-lg text-xl"
                  >
                    -
                  </button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="bg-gray-200 px-3 py-1 rounded-lg text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="block text-center w-full bg-blue-950 text-white py-3 rounded-xl hover:bg-blue-900"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
