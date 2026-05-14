import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const { data } = await api.put("/auth/profile", payload);

      updateUser(data);

      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/profile"
          className="mb-6 inline-block rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          ← Back to Profile
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            My Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Edit Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Update your name, email, or password.
          </p>

          {error && (
            <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                type="email"
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                required
              />
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="text-lg font-black text-slate-950">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Leave these blank if you do not want to change your password.
              </p>

              <div className="mt-4 space-y-4">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New password"
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                />

                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
