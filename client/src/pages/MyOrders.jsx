import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get("/orders/my-orders")
      .then(({ data }) => {
        if (!ignore) {
          setOrders(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load orders.");
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

  const getPaymentBadge = (isPaid) => {
    return isPaid
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-yellow-50 text-yellow-700 border-yellow-100";
  };

  const getStatusBadge = (status) => {
    if (status === "Paid")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "Shipped") return "bg-blue-50 text-blue-700 border-blue-100";
    if (status === "Delivered")
      return "bg-slate-900 text-white border-slate-900";
    if (status === "Canceled") return "bg-red-50 text-red-600 border-red-100";

    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-7xl mx-auto rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            My Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Track your purchases, payment status, and shipping progress.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              No orders yet
            </h2>

            <p className="mt-2 text-slate-500">
              Once you place an order, it will show up here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Go Shopping
            </Link>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-slate-950">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getPaymentBadge(
                          order.isPaid,
                        )}`}
                      >
                        {order.isPaid ? "Paid" : "Pending Payment"}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    {order.paidAt && (
                      <p className="mt-1 text-sm text-slate-500">
                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-950">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <Link
                      to={`/orders/${order._id}`}
                      className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-700">
                    Shipping Address
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Items
                  </p>

                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div
                        key={item._id || item.product || index}
                        className="flex items-center gap-4 rounded-3xl bg-slate-50 p-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-2xl object-cover bg-white"
                        />

                        <div className="flex-1">
                          <p className="font-bold text-slate-950">
                            {item.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            Qty {item.quantity} × ${item.price}
                          </p>
                        </div>

                        <p className="font-black text-slate-950">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
