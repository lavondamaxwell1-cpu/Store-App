import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../context/useAuth";

const MyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setOrders(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-950">My Orders</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-gray-600 mb-4">
            You have not placed any orders yet.
          </p>

          <Link
            to="/"
            className="inline-block bg-blue-950 text-white px-5 py-3 rounded-xl hover:bg-blue-900"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-blue-950">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {order.status}
                  </span>

                  <span className="font-bold text-lg">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-t pt-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>

                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Ship to: {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
