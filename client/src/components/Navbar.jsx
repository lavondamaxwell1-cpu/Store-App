import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-white" : "text-slate-300 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-black tracking-tight text-white"
          >
            Lavonda Store
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/cart" className={linkClass}>
              Cart ({totalCartItems})
            </NavLink>

            {user ? (
              <>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>

                <NavLink to="/my-orders" className={linkClass}>
                  My Orders
                </NavLink>

                {user.role === "admin" && (
                  <>
                    <NavLink to="/admin" className={linkClass}>
                      Dashboard
                    </NavLink>

                    <NavLink to="/admin/products" className={linkClass}>
                      Products
                    </NavLink>

                    <NavLink to="/admin/orders" className={linkClass}>
                      Orders
                    </NavLink>

                    <NavLink to="/admin/coupons" className={linkClass}>
                      Coupons
                    </NavLink>
                    <NavLink to="/admin/reports" className={linkClass}>
                      Reports
                    </NavLink>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>

                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-white md:hidden"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="space-y-2">
              <NavLink to="/" onClick={closeMenu} className={mobileLinkClass}>
                Home
              </NavLink>

              <NavLink
                to="/cart"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Cart ({totalCartItems})
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Profile
                  </NavLink>

                  <NavLink
                    to="/my-orders"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </NavLink>

                  {user.role === "admin" && (
                    <>
                      <div className="px-4 pt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        Admin
                      </div>

                      <NavLink
                        to="/admin"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Dashboard
                      </NavLink>

                      <NavLink
                        to="/admin/products"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Products
                      </NavLink>
                      <NavLink
                        to="/admin/coupons"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Coupons
                      </NavLink>
                      <NavLink
                        to="/admin/orders"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Orders
                      </NavLink>
                      <NavLink
                        to="/admin/reports"
                        onClick={closeMenu}
                        className={mobileLinkClass}
                      >
                        Reports
                      </NavLink>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-200 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
