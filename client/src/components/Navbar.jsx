import { Link } from "react-router-dom";
import useCart from "../context/useCart";
import useAuth from "../context/useAuth";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-950 text-white px-8 py-5 shadow-lg">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold">
          Lavonda Store
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-300">
            Home
          </Link>

          <Link to="/" className="hover:text-blue-300">
            Shop
          </Link>

          {user ? (
            <>
              <span className="text-blue-200">Hi, {user.name}</span>
              {user?.role === "admin" && (
                <Link to="/admin/products" className="hover:text-blue-300">
                  Admin
                </Link>
              )}
              {user && (
                <Link to="/my-orders" className="hover:text-blue-300">
                  My Orders
                </Link>
              )}
              <button onClick={logout} className="hover:text-blue-300">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-300">
              Login
            </Link>
          )}

          <Link
            to="/cart"
            className="bg-blue-800 px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Cart ({cartCount})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
