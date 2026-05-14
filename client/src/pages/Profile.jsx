import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const Profile = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            My Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your account and quickly access your store activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 text-3xl font-black text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {user?.name || "Customer"}
                </h2>

                <p className="mt-1 text-slate-500">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-700">Role</p>
                <p className="mt-2 text-2xl font-black capitalize text-slate-950">
                  {user?.role || "customer"}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-700">Cart Items</p>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {totalCartItems}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-700">
                  Account Status
                </p>
                <p className="mt-2 text-2xl font-black text-emerald-700">
                  Active
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Quick Actions
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Jump back into shopping, check your orders, or sign out.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/profile/edit"
                className="block rounded-full bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Edit Profile
              </Link>
              <Link
                to="/my-orders"
                className="block rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                My Orders
              </Link>
              <Link
                to="/wishlist"
                className="block rounded-full bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                My Wishlist
              </Link>
              <Link
                to="/cart"
                className="block rounded-full bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                View Cart
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="block rounded-full bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Account Details
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-700">Full Name</p>
              <p className="mt-2 text-slate-500">{user?.name || "Not set"}</p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-700">Email Address</p>
              <p className="mt-2 break-all text-slate-500">
                {user?.email || "Not set"}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-700">User Role</p>
              <p className="mt-2 capitalize text-slate-500">
                {user?.role || "customer"}
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-700">Cart Count</p>
              <p className="mt-2 text-slate-500">
                {totalCartItems} item{totalCartItems === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
