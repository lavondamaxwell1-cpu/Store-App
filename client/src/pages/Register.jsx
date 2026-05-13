import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-950 mb-6">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border p-3 rounded-xl"
            required
          />

          <button className="w-full bg-blue-950 text-white py-3 rounded-xl hover:bg-blue-900">
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-900 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
