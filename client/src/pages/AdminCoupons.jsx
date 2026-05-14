import { useEffect, useState } from "react";
import api from "../services/api";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiresAt: "",
  });

  const fetchCoupons = async () => {
    const { data } = await api.get("/coupons");
    setCoupons(data);
  };

  useEffect(() => {
    let ignore = false;

    api
      .get("/coupons")
      .then(({ data }) => {
        if (!ignore) {
          setCoupons(data);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setError(error.response?.data?.message || "Failed to load coupons.");
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
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "code"
          ? e.target.value.toUpperCase()
          : e.target.value,
    }));
  };

  const createCoupon = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      setError("Coupon code is required.");
      return;
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      setError("Discount value must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/coupons", {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        expiresAt: formData.expiresAt || null,
      });

      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        expiresAt: "",
      });

      setSuccess("Coupon created successfully.");
      await fetchCoupons();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create coupon.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (couponId) => {
    try {
      setActionId(couponId);
      setError("");
      setSuccess("");

      await api.put(`/coupons/${couponId}/toggle`);

      setSuccess("Coupon updated successfully.");
      await fetchCoupons();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update coupon.");
    } finally {
      setActionId("");
    }
  };

  const deleteCoupon = async (couponId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this coupon?",
    );

    if (!confirmDelete) return;

    try {
      setActionId(couponId);
      setError("");
      setSuccess("");

      await api.delete(`/coupons/${couponId}`);

      setSuccess("Coupon deleted successfully.");
      await fetchCoupons();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete coupon.");
    } finally {
      setActionId("");
    }
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% off`;
    }

    return `$${Number(coupon.discountValue).toFixed(2)} off`;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Coupons
          </h1>

          <p className="mt-2 text-slate-500">
            Create, activate, deactivate, and manage customer discount codes.
          </p>
        </div>

        {(error || success) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-700">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Create Coupon
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Make a discount code customers can enter at checkout.
            </p>

            <form onSubmit={createCoupon} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Coupon Code
                </label>

                <input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="SAVE10"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm uppercase outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Discount Type
                </label>

                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Discount Value
                </label>

                <input
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={
                    formData.discountType === "percentage" ? "10" : "5"
                  }
                  type="number"
                  min="1"
                  step="0.01"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                  required
                />

                <p className="mt-2 text-xs text-slate-400">
                  {formData.discountType === "percentage"
                    ? "Example: 10 means 10% off."
                    : "Example: 5 means $5 off."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Expiration Date
                </label>

                <input
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/10 transition"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Optional. Leave blank if the coupon should not expire.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {saving ? "Creating..." : "Create Coupon"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-950">
                Coupon List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading coupons..."
                  : `${coupons.length} coupon${
                      coupons.length === 1 ? "" : "s"
                    } created`}
              </p>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">
                Loading coupons...
              </div>
            ) : coupons.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-slate-500">
                No coupons created yet.
              </div>
            ) : (
              <div className="space-y-4">
                {coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiresAt);

                  return (
                    <div
                      key={coupon._id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-2xl font-black tracking-wide text-slate-950">
                              {coupon.code}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                coupon.isActive && !expired
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {expired
                                ? "Expired"
                                : coupon.isActive
                                  ? "Active"
                                  : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-600">
                            {formatDiscount(coupon)}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {coupon.expiresAt
                              ? `Expires ${new Date(
                                  coupon.expiresAt,
                                ).toLocaleDateString()}`
                              : "No expiration date"}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => toggleCoupon(coupon._id)}
                            disabled={actionId === coupon._id || expired}
                            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
                          >
                            {actionId === coupon._id
                              ? "Updating..."
                              : coupon.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteCoupon(coupon._id)}
                            disabled={actionId === coupon._id}
                            className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                          >
                            {actionId === coupon._id ? "Working..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
