import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/useCart";
import toast from "react-hot-toast";
import { fallbackImage } from "../utils/fallbackImage";

const Checkout = () => {
  const { cartItems } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  const discountAmount = Number(coupon?.discountAmount || 0);
  const finalTotal = Math.max(subtotal - discountAmount, 0);

  const handleShippingChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");

      const { data } = await api.post("/coupons/validate", {
        code: couponCode,
        subtotal,
      });

      setCoupon(data);
      toast.success(`Coupon ${data.code} applied`);
    } catch (error) {
      setCoupon(null);
      setCouponError(error.response?.data?.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.post("/payments/create-checkout-session", {
        cartItems,
        shippingAddress,
        couponCode: coupon?.code || "",
      });

      window.location.href = data.url;
    } catch (error) {
      setError(error.response?.data?.message || "Checkout failed.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-2 text-slate-500">
            Add products to your cart before checking out.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Checkout
          </h1>

          <p className="mt-2 text-slate-500">
            Enter your shipping details and apply any coupon before payment.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCheckout}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Shipping Address
              </h2>

              <div className="mt-6 space-y-4">
                <input
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  placeholder="Street address"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  required
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    placeholder="City"
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                    required
                  />

                  <input
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    placeholder="Postal code"
                    className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Order Items
              </h2>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4"
                  >
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-20 w-20 rounded-2xl object-cover bg-white"
                    />

                    <div className="flex-1">
                      <p className="font-black text-slate-950">{item.name}</p>

                      <p className="mt-1 text-sm text-slate-500">
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
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Coupon Code
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                <input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                />

                {!coupon ? (
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 transition"
                  >
                    {couponLoading ? "Applying..." : "Apply Coupon"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="rounded-full bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    Remove Coupon
                  </button>
                )}
              </div>

              {couponError && (
                <p className="mt-3 text-sm font-semibold text-red-600">
                  {couponError}
                </p>
              )}

              {coupon && (
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  Coupon {coupon.code} applied. You saved $
                  {Number(coupon.discountAmount).toFixed(2)}.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-700">
                    <span>Discount</span>
                    <span>- ${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-black text-slate-950">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Redirecting..." : "Pay with Stripe"}
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-6 text-white">
              <p className="text-sm font-bold">Secure payment</p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                You will be redirected to Stripe to complete your payment.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
