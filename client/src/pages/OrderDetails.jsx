import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { fallbackImage } from "../utils/fallbackImage";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelBox, setShowCancelBox] = useState(false);

  const [loading, setLoading] = useState(true);
  const [requestingCancel, setRequestingCancel] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const requestCancellation = async (e) => {
    e.preventDefault();

    try {
      setRequestingCancel(true);
      setError("");
      setSuccess("");

      const { data } = await api.put(`/orders/${id}/request-cancel`, {
        cancelReason,
      });

      setOrder(data);
      setCancelReason("");
      setShowCancelBox(false);
      setSuccess("Cancellation request submitted.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to request cancellation.",
      );
    } finally {
      setRequestingCancel(false);
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

  const getCancelBadge = (cancelStatus) => {
    if (cancelStatus === "Approved") {
      return "bg-red-50 text-red-600";
    }

    if (cancelStatus === "Denied") {
      return "bg-slate-100 text-slate-700";
    }

    if (cancelStatus === "Pending") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/my-orders"
            className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            ← Back to My Orders
          </Link>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const canRequestCancel =
    order.status !== "Shipped" &&
    order.status !== "Delivered" &&
    order.status !== "Canceled" &&
    order.cancelStatus !== "Pending" &&
    order.cancelStatus !== "Approved";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/my-orders"
          className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
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
              <h2 className="text-2xl font-black text-slate-950">Tracking</h2>

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
                      Track Package
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-slate-500">
                  Tracking information has not been added yet.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Cancellation
              </h2>

              {order.cancelStatus && order.cancelStatus !== "None" ? (
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${getCancelBadge(
                      order.cancelStatus,
                    )}`}
                  >
                    Cancellation {order.cancelStatus}
                  </span>

                  {order.cancelReason && (
                    <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      <span className="font-bold text-slate-700">Reason:</span>{" "}
                      {order.cancelReason}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-400">
                    Debug: status={order.status}, cancelStatus=
                    {order.cancelStatus || "missing"}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-slate-500">
                  No cancellation request has been submitted.
                </p>
              )}

              {canRequestCancel && !showCancelBox && (
                <button
                  type="button"
                  onClick={() => setShowCancelBox(true)}
                  className="mt-5 rounded-full bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  Request Cancellation
                </button>
              )}

              {showCancelBox && (
                <form onSubmit={requestCancellation} className="mt-5 space-y-4">
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Optional: tell us why you want to cancel this order..."
                    rows="4"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={requestingCancel}
                      className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                    >
                      {requestingCancel ? "Submitting..." : "Submit Request"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowCancelBox(false);
                        setCancelReason("");
                      }}
                      className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                      Never Mind
                    </button>
                  </div>
                </form>
              )}
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
              <h2 className="text-lg font-black text-slate-950">Need help?</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You can request cancellation before your order ships. Once an
                order has shipped, it can no longer be canceled from this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
