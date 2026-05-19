import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusSavingId, setStatusSavingId] = useState("");
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [cancelFilter, setCancelFilter] = useState("All");
  useEffect(() => {
    let ignore = false;

    api
      .get("/orders")
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

  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name || "";
    const customerEmail = order.user?.email || "";
    const matchesCancel =
      cancelFilter === "All" || order.cancelStatus === cancelFilter;
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    const matchesPayment =
      selectedPayment === "All" ||
      (selectedPayment === "Paid" && order.isPaid) ||
      (selectedPayment === "Unpaid" && !order.isPaid);

    return matchesSearch && matchesStatus && matchesPayment && matchesCancel;
  });

  const updateOrderStatus = async (orderId, status) => {
    try {
      setStatusSavingId(orderId);
      setError("");
      setSuccess("");

      const { data } = await api.put(`/orders/${orderId}/status`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data : order)),
      );

      setSuccess("Order status updated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update order.");
    } finally {
      setStatusSavingId("");
    }
  };

  const getPaymentBadge = (isPaid) => {
    return isPaid
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-yellow-50 text-yellow-700 border-yellow-100";
  };

  const getStatusBadge = (status) => {
    if (status === "Paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "Shipped") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "Delivered") {
      return "bg-slate-900 text-white border-slate-900";
    }

    if (status === "Canceled") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Search, filter, review, and manage customer orders.
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

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Order List</h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading orders..."
                  : `Showing ${filteredOrders.length} of ${orders.length} order${
                      orders.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customer or order ID..."
                className="md:col-span-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              />

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>

              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              <select
                value={cancelFilter}
                onChange={(e) => setCancelFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10"
              >
                <option value="All">All Cancellation Statuses</option>
                <option value="Pending">Cancellation Requested</option>
                <option value="Approved">Cancellation Approved</option>
                <option value="Denied">Cancellation Denied</option>
              </select>
            </div>
          </div>

          {(searchTerm ||
            selectedStatus !== "All" ||
            selectedPayment !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("All");
                setSelectedPayment("All");
              }}
              className="mt-5 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            No orders found.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-950">
                      {order.user?.name || "Unknown Customer"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {order.user?.email || "No email"}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-bold ${getPaymentBadge(
                        order.isPaid,
                      )}`}
                    >
                      {order.isPaid ? "Paid" : "Pending Payment"}
                    </span>

                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-bold ${getStatusBadge(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                    {order.cancelStatus === "Pending" && (
                      <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                        Cancellation Requested
                      </span>
                    )}

                    {order.cancelStatus === "Approved" && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                        Cancellation Approved
                      </span>
                    )}

                    {order.cancelStatus === "Denied" && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Cancellation Denied
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-700">Total</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-700">Items</p>
                    <p className="mt-1 text-2xl font-black text-slate-950">
                      {order.orderItems.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-700">Shipping</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.shippingAddress?.city || "No city"},{" "}
                      {order.shippingAddress?.postalCode || "No postal code"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="rounded-full bg-slate-950 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      View Details
                    </Link>

                    {/* <Link
                      to={`/orders/${order._id}`}
                      className="rounded-full bg-slate-100 px-5 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                      Customer View
                    </Link> */}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      disabled={statusSavingId === order._id}
                      className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition disabled:bg-slate-100"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>

                    {statusSavingId === order._id && (
                      <p className="text-sm font-semibold text-slate-500">
                        Saving...
                      </p>
                    )}
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

export default AdminOrders;
