import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse] = await Promise.all([
          api.get("/products"),
          api.get("/orders"),
        ]);

        if (!ignore) {
          setProducts(productsResponse.data);
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message || "Failed to load dashboard data.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const paidOrders = orders.filter((order) => order.isPaid);
    const pendingOrders = orders.filter((order) => !order.isPaid);
    const shippedOrders = orders.filter((order) => order.status === "Shipped");
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered",
    );
    const canceledOrders = orders.filter(
      (order) => order.status === "Canceled",
    );

    const totalRevenue = paidOrders.reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0,
    );

    const lowStockProducts = products.filter(
      (product) =>
        Number(product.countInStock || 0) > 0 && product.countInStock <= 5,
    );

    const outOfStockProducts = products.filter(
      (product) => Number(product.countInStock || 0) <= 0,
    );

    return {
      totalRevenue,
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      shippedOrders: shippedOrders.length,
      deliveredOrders: deliveredOrders.length,
      canceledOrders: canceledOrders.length,
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
    };
  }, [orders, products]);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const chartData = [
    {
      label: "Paid",
      value: stats.paidOrders,
      className: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      className: "bg-yellow-500",
    },
    {
      label: "Shipped",
      value: stats.shippedOrders,
      className: "bg-blue-500",
    },
    {
      label: "Delivered",
      value: stats.deliveredOrders,
      className: "bg-slate-900",
    },
    {
      label: "Canceled",
      value: stats.canceledOrders,
      className: "bg-red-500",
    },
  ];

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      subtitle: "From paid orders",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtitle: "All customer orders",
    },
    {
      title: "Paid Orders",
      value: stats.paidOrders,
      subtitle: "Completed payments",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      subtitle: "Need payment or review",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      subtitle: "Active store products",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      subtitle: "Products with 1-5 left",
    },
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Store Overview
            </h1>

            <p className="mt-2 text-slate-500">
              Review revenue, orders, products, and inventory at a glance.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin/products/new"
              className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Add Product
            </Link>

            <Link
              to="/admin/orders"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
            >
              View Orders
            </Link>

            <Link
              to="/admin/coupons"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
            >
              Manage Coupons
            </Link>
            <Link
              to="/admin/reports"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
            >
              View Reports
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold text-slate-500">{card.title}</p>

              <p className="mt-3 text-4xl font-black text-slate-950">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-400">{card.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-950">
                Order Status Chart
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                A quick look at where your orders stand.
              </p>
            </div>

            <div className="space-y-5">
              {chartData.map((item) => {
                const width = `${(item.value / maxChartValue) * 100}%`;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-700">
                        {item.label}
                      </span>

                      <span className="font-black text-slate-950">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.className}`}
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Inventory Alerts
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep an eye on products that may need restocking.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-yellow-50 p-5">
                <p className="text-sm font-bold text-yellow-700">Low Stock</p>
                <p className="mt-2 text-4xl font-black text-yellow-700">
                  {stats.lowStockProducts}
                </p>
              </div>

              <div className="rounded-3xl bg-red-50 p-5">
                <p className="text-sm font-bold text-red-600">Out of Stock</p>
                <p className="mt-2 text-4xl font-black text-red-600">
                  {stats.outOfStockProducts}
                </p>
              </div>

              <Link
                to="/admin/products"
                className="block rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer activity in your store.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="rounded-full bg-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">
              No recent orders yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>

                    <h3 className="mt-1 font-black text-slate-950">
                      {order.user?.name || "Unknown Customer"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-bold ${getStatusBadge(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>

                    <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
                      ${Number(order.totalPrice || 0).toFixed(2)}
                    </span>

                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
