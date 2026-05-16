import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { fallbackImage } from "../utils/fallbackImage";

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersResponse, productsResponse, couponsResponse] =
          await Promise.all([
            api.get("/orders"),
            api.get("/products"),
            api.get("/coupons"),
          ]);

        if (!ignore) {
          setOrders(ordersResponse.data);
          setProducts(productsResponse.data);
          setCoupons(couponsResponse.data);
        }
      } catch (error) {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load reports.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      ignore = true;
    };
  }, []);

  const reports = useMemo(() => {
    const paidOrders = orders.filter((order) => order.isPaid);

    const totalRevenue = paidOrders.reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0
    );

    const totalDiscounts = paidOrders.reduce(
      (total, order) => total + Number(order.discountAmount || 0),
      0
    );

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const ordersThisMonth = paidOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });

    const revenueThisMonth = ordersThisMonth.reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0
    );

    const productSalesMap = {};

    paidOrders.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const productId = item.product || item._id || item.name;

        if (!productSalesMap[productId]) {
          productSalesMap[productId] = {
            id: productId,
            name: item.name,
            image: item.image,
            quantitySold: 0,
            revenue: 0,
          };
        }

        productSalesMap[productId].quantitySold += Number(item.quantity || 0);
        productSalesMap[productId].revenue +=
          Number(item.price || 0) * Number(item.quantity || 0);
      });
    });

    const bestSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    const mostReviewedProducts = [...products]
      .filter((product) => Number(product.numReviews || 0) > 0)
      .sort((a, b) => Number(b.numReviews || 0) - Number(a.numReviews || 0))
      .slice(0, 5);

    const lowStockProducts = [...products]
      .filter(
        (product) =>
          Number(product.countInStock || 0) > 0 &&
          Number(product.countInStock || 0) <= 5
      )
      .sort((a, b) => Number(a.countInStock || 0) - Number(b.countInStock || 0))
      .slice(0, 5);

    const outOfStockProducts = products.filter(
      (product) => Number(product.countInStock || 0) <= 0
    );

    const recentPaidOrders = [...paidOrders]
      .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt))
      .slice(0, 5);

    return {
      paidOrders,
      totalRevenue,
      totalDiscounts,
      revenueThisMonth,
      ordersThisMonth,
      bestSellingProducts,
      mostReviewedProducts,
      lowStockProducts,
      outOfStockProducts,
      recentPaidOrders,
    };
  }, [orders, products]);

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${reports.totalRevenue.toFixed(2)}`,
      subtitle: "All paid orders",
    },
    {
      title: "Revenue This Month",
      value: `$${reports.revenueThisMonth.toFixed(2)}`,
      subtitle: `${reports.ordersThisMonth.length} paid order${
        reports.ordersThisMonth.length === 1 ? "" : "s"
      } this month`,
    },
    {
      title: "Paid Orders",
      value: reports.paidOrders.length,
      subtitle: "Completed payments",
    },
    {
      title: "Discounts Given",
      value: `$${reports.totalDiscounts.toFixed(2)}`,
      subtitle: "Coupon savings used",
    },
    {
      title: "Active Coupons",
      value: coupons.filter((coupon) => coupon.isActive).length,
      subtitle: `${coupons.length} total coupon${
        coupons.length === 1 ? "" : "s"
      }`,
    },
    {
      title: "Out of Stock",
      value: reports.outOfStockProducts.length,
      subtitle: "Products needing restock",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading reports...</p>
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
              Admin Analytics
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Reports
            </h1>

            <p className="mt-2 text-slate-500">
              Review sales, coupons, inventory, and customer activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/orders"
              className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              View Orders
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

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Best-Selling Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Products with the most units sold.
                </p>
              </div>

              <Link
                to="/admin/products"
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Products
              </Link>
            </div>

            {reports.bestSellingProducts.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-slate-500">
                No paid product sales yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.bestSellingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4"
                  >
                    <img
                      src={product.image || fallbackImage}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-16 w-16 rounded-2xl object-cover bg-white"
                    />

                    <div className="flex-1">
                      <p className="font-black text-slate-950">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.quantitySold} sold
                      </p>
                    </div>

                    <p className="font-black text-slate-950">
                      ${product.revenue.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Low Stock
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Products with 1-5 items left.
                </p>
              </div>

              <Link
                to="/admin/products"
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Manage
              </Link>
            </div>

            {reports.lowStockProducts.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-slate-500">
                No low-stock products right now.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4"
                  >
                    <img
                      src={product.image || fallbackImage}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-16 w-16 rounded-2xl object-cover bg-white"
                    />

                    <div className="flex-1">
                      <p className="font-black text-slate-950">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.category}
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-700">
                      {product.countInStock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Most Reviewed Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Products customers are talking about.
            </p>

            {reports.mostReviewedProducts.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-slate-500">
                No product reviews yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {reports.mostReviewedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4"
                  >
                    <img
                      src={product.image || fallbackImage}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-16 w-16 rounded-2xl object-cover bg-white"
                    />

                    <div className="flex-1">
                      <p className="font-black text-slate-950">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        ⭐ {Number(product.rating || 0).toFixed(1)} rating
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      {product.numReviews} review
                      {product.numReviews === 1 ? "" : "s"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Recent Paid Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest completed payments.
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Orders
              </Link>
            </div>

            {reports.recentPaidOrders.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-slate-500">
                No paid orders yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reports.recentPaidOrders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-3xl bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>

                        <p className="mt-1 font-black text-slate-950">
                          {order.user?.name || "Unknown Customer"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(
                            order.paidAt || order.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                          Paid
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-950">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="mt-4 inline-block rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;