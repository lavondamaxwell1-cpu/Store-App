import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { fallbackImage } from "../utils/fallbackImage";

const AdminOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  const [trackingData, setTrackingData] = useState({
    shippingCarrier: "",
    trackingNumber: "",
    trackingUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingTracking, setSavingTracking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;

    api
      .get(`/orders/${id}`)
      .then(({ data }) => {
        if (!ignore) {
          setOrder(data);
          setStatus(data.status);

          setTrackingData({
            shippingCarrier: data.shippingCarrier || "",
            trackingNumber: data.trackingNumber || "",
            trackingUrl: data.trackingUrl || "",
          });
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

  const updateStatus = async () => {
    try {
      setSavingStatus(true);
      setError("");
      setSuccess("");

      const { data } = await api.put(`/orders/${id}/status`, {
        status,
      });

      setOrder(data);
      setStatus(data.status);
      setSuccess("Order status updated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleTrackingChange = (e) => {
    setTrackingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateTracking = async (e) => {
    e.preventDefault();

    try {
      setSavingTracking(true);
      setError("");
      setSuccess("");

      const { data } = await api.put(`/orders/${id}/tracking`, trackingData);

      setOrder(data);
      setStatus(data.status);

      setTrackingData({
        shippingCarrier: data.shippingCarrier || "",
        trackingNumber: data.trackingNumber || "",
        trackingUrl: data.trackingUrl || "",
      });

      setSuccess("Tracking information updated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update tracking.");
    } finally {
      setSavingTracking(false);
    }
  };

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
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/admin/orders"
            className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            ← Back to Orders
          </Link>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin/orders"
          className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          ← Back to Orders
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin Order Details
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>

          <p className="mt-2 text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {(error || success) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-700">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">Customer</h2>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-700">Name</p>
                  <p className="mt-1 text-slate-500">
                    {order.user?.name || "Unknown"}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-700">Email</p>
                  <p className="mt-1 break-all text-slate-500">
                    {order.user?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Order Items
              </h2>

              <div className="mt-5 space-y-3">
                {order.orderItems.map((item, index) => (
                  <div
                    key={item._id || item.product || index}
                    className="flex items-center gap-4 rounded-3xl bg-slate-50 p-3"
                  >
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-20 w-20 rounded-2xl bg-white object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-bold text-slate-950">{item.name}</p>

                      <p className="text-sm text-slate-500">
                        Qty {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <p className="font-black text-slate-950">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
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

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Tracking Information
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add shipping details after the order has been fulfilled.
              </p>

              <form onSubmit={updateTracking} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Shipping Carrier
                  </label>

                  <input
                    name="shippingCarrier"
                    value={trackingData.shippingCarrier}
                    onChange={handleTrackingChange}
                    placeholder="USPS, UPS, FedEx, DHL..."
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tracking Number
                  </label>

                  <input
                    name="trackingNumber"
                    value={trackingData.trackingNumber}
                    onChange={handleTrackingChange}
                    placeholder="Tracking number"
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tracking URL
                  </label>

                  <input
                    name="trackingUrl"
                    value={trackingData.trackingUrl}
                    onChange={handleTrackingChange}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingTracking}
                  className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  {savingTracking ? "Saving Tracking..." : "Save Tracking"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">Summary</h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-950">
                    $
                    {Number(order.subtotalPrice || order.totalPrice).toFixed(2)}
                  </span>
                </div>

                {Number(order.discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-black">
                      -${Number(order.discountAmount).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.couponCode && (
                  <div className="flex justify-between text-slate-500">
                    <span>Coupon</span>
                    <span className="font-black text-slate-950">
                      {order.couponCode}
                    </span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-black text-slate-950">
                  <span>Total</span>
                  <span>${Number(order.totalPrice).toFixed(2)}</span>
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

                {order.shippedAt && (
                  <p className="text-sm text-slate-500">
                    Shipped on {new Date(order.shippedAt).toLocaleDateString()}
                  </p>
                )}

                {order.deliveredAt && (
                  <p className="text-sm text-slate-500">
                    Delivered on{" "}
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Manage Status
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Update this order as it moves through fulfillment.
              </p>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>

              <button
                type="button"
                onClick={updateStatus}
                disabled={savingStatus || status === order.status}
                className="mt-4 w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {savingStatus ? "Updating..." : "Update Status"}
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">
                Tracking Preview
              </h2>

              {order.trackingNumber ? (
                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <span className="font-bold text-slate-700">Carrier:</span>{" "}
                    <span className="text-slate-500">
                      {order.shippingCarrier || "Not provided"}
                    </span>
                  </p>

                  <p>
                    <span className="font-bold text-slate-700">Tracking:</span>{" "}
                    <span className="text-slate-500">
                      {order.trackingNumber}
                    </span>
                  </p>

                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Open Tracking
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  No tracking has been added yet.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">
                Full Order ID
              </h2>

              <p className="mt-2 break-all text-sm text-slate-500">
                {order._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
