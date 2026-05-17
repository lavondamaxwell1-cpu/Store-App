import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Page Not Found
          </p>

          <h1 className="mt-4 text-7xl font-black tracking-tight text-slate-950 md:text-8xl">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Oops, this page wandered off.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            The page you are looking for does not exist, may have moved, or the
            link may be incorrect. No worries — we can get you back to shopping.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Back to Home
            </Link>

            <Link
              to="/cart"
              className="rounded-full bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              View Cart
            </Link>

            <Link
              to="/profile"
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
            >
              My Account
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50 transition"
          >
            <p className="font-black text-slate-950">Shop Products</p>
            <p className="mt-1 text-sm text-slate-500">
              Browse the storefront and find something new.
            </p>
          </Link>

          <Link
            to="/wishlist"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50 transition"
          >
            <p className="font-black text-slate-950">Wishlist</p>
            <p className="mt-1 text-sm text-slate-500">
              Return to your saved favorites.
            </p>
          </Link>

          <Link
            to="/my-orders"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50 transition"
          >
            <p className="font-black text-slate-950">My Orders</p>
            <p className="mt-1 text-sm text-slate-500">
              Check your order history and tracking.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
