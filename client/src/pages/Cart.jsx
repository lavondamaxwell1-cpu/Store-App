import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { fallbackImage } from "../utils/fallbackImage";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, decreaseFromCart, clearCart } =
    useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-4xl font-black text-slate-950">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-500">
            Looks like you have not added anything yet.
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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Shopping Cart
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Your Cart
            </h1>

            <p className="mt-2 text-slate-500">
              Review your items before checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="rounded-full bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-32 w-full rounded-2xl bg-slate-50 object-cover md:w-32"
                    />
                  </Link>

                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {item.category}
                    </p>

                    <Link to={`/product/${item._id}`}>
                      <h2 className="mt-1 text-xl font-black text-slate-950 hover:underline">
                        {item.name}
                      </h2>
                    </Link>

                    <p className="mt-2 text-sm text-slate-500">
                      ${Number(item.price).toFixed(2)} each
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-400">
                      Stock: {item.countInStock}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 md:items-end">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseFromCart(item._id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-black text-slate-700 hover:bg-slate-200 transition"
                      >
                        -
                      </button>

                      <span className="min-w-10 text-center text-lg font-black text-slate-950">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        disabled={item.quantity >= item.countInStock}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-xl font-black text-slate-950">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="rounded-full bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-slate-500">
                <span>Items</span>
                <span>
                  {cartItems.reduce(
                    (total, item) => total + Number(item.quantity),
                    0,
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-black text-slate-950">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="block rounded-full bg-slate-950 px-6 py-4 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="block rounded-full bg-slate-100 px-6 py-4 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-700">
                Coupon codes are applied at checkout.
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                You can enter your discount code on the checkout page before
                paying with Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
