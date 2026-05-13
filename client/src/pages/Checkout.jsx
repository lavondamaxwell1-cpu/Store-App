import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../context/useCart";
import useAuth from "../context/useAuth";
import api from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const placeOrder = async () => {
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      setError("Please fill out your shipping address.");
      return;
    }

    try {
      setLoading(true);

      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await api.post(
        "/orders",
        {
          orderItems,
          shippingAddress,
          totalPrice: cartTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-950">Checkout</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">Customer Info</h2>

          <div className="space-y-4">
            <input
              value={user?.name || ""}
              readOnly
              className="w-full border p-3 rounded-xl bg-gray-100"
            />

            <input
              value={user?.email || ""}
              readOnly
              className="w-full border p-3 rounded-xl bg-gray-100"
            />

            <input
              name="address"
              value={shippingAddress.address}
              onChange={handleChange}
              placeholder="Shipping Address"
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="city"
              value={shippingAddress.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="w-full border p-3 rounded-xl"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="mt-6 w-full bg-blue-950 text-white py-3 rounded-xl hover:bg-blue-900 disabled:bg-gray-400"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
