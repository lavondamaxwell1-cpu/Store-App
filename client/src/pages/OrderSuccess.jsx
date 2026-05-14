import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import {useCart }from "../context/useCart";

const OrderSuccess = () => {
  const { id } = useParams();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <span className="text-4xl">✓</span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Order Confirmed
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Payment Successful
          </h1>

          <p className="mt-3 text-slate-500">
            Thank you for your order. Your payment was processed securely.
          </p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Order ID
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-slate-700">
              {id}
            </p>
          </div>

          {loading && (
            <p className="mt-6 text-sm text-slate-500">
              Checking payment status...
            </p>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-3xl border border-yellow-100 bg-yellow-50 p-5 text-yellow-700">
              {error}
            </div>
          )}

          {!loading && order && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col items-center gap-3">
                <span
                  className={`rounded-full border px-4 py-2 text-sm font-bold ${
                    order.isPaid
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-yellow-100 bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </span>

                <p className="text-2xl font-black text-slate-950">
                  ${order.totalPrice.toFixed(2)}
                </p>

                {order.paidAt && (
                  <p className="text-sm text-slate-500">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/my-orders"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              View My Orders
            </Link>

            <Link
              to="/"
              className="rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
