import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get(`/orders/${id}`)
      .then(({ data }) => {
        if (!ignore) {
          setOrder(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load order.");
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
  }, [id]);

  const getPaymentBadge = (isPaid) => {
    return isPaid
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-yellow-100 bg-yellow-50 text-yellow-700";
  };

  const getStatusBadge = (status) => {
    if (status === "Paid") {
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }

    if (status === "Shipped") {
      return "border-blue-100 bg-blue-50 text-blue-700";
    }

    if (status === "Delivered") {
      return "border-slate-900 bg-slate-900 text-white";
    }

    if (status === "Canceled") {
      return "border-red-100 bg-red-50 text-red-600";
    }

    return "border-yellow-100 bg-yellow-50 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/my-orders"
            className="mb-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
          >
            ← Back to My Orders
          </Link>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            {error || "Order not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/my-orders"
          className="mb-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
        >
          ← Back to My Orders
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Order Receipt
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>

          <p className="mt-2 text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Order Items
              </h2>

              <div className="mt-5 space-y-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 rounded-3xl bg-slate-50 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-2xl object-cover bg-white"
                    />

                    <div className="flex-1">
                      <p className="font-bold text-slate-950">{item.name}</p>

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

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Shipping Address
              </h2>

              <p className="mt-3 text-slate-500">
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">Summary</h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-slate-500">
                  <span>Total</span>
                  <span className="font-black text-slate-950">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <span
                    className={`inline-block rounded-full border px-4 py-2 text-sm font-bold ${getPaymentBadge(
                      order.isPaid,
                    )}`}
                  >
                    {order.isPaid ? "Paid" : "Pending Payment"}
                  </span>

                  <br />

                  <span
                    className={`inline-block rounded-full border px-4 py-2 text-sm font-bold ${getStatusBadge(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.paidAt && (
                  <p className="text-sm text-slate-500">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Need help?</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep this order number for your records. You can check your
                order status anytime from My Orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
