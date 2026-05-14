import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth }from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="max-w-md mx-auto">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Welcome Back
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Login
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to checkout, view orders, and manage your account.
          </p>

          {error && (
            <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              required
            />

            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
              required
            />

            <button className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an account?{" "}
            <Link to="/register" className="font-bold text-slate-950">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
