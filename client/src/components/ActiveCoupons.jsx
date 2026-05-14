import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ActiveCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    api
      .get("/coupons/active")
      .then(({ data }) => {
        if (!ignore) {
          setCoupons(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCoupons([]);
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

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`${code} copied`);
    } catch {
      toast.error("Could not copy coupon code.");
    }
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% off`;
    }

    return `$${Number(coupon.discountValue).toFixed(2)} off`;
  };

  if (loading) {
    return null;
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Deals
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Active Coupons
          </h2>

          <p className="mt-2 text-slate-500">
            Copy a code and apply it at checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-black tracking-wide text-slate-950">
                    {coupon.code}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    {formatDiscount(coupon)}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {coupon.expiresAt
                      ? `Expires ${new Date(
                          coupon.expiresAt,
                        ).toLocaleDateString()}`
                      : "No expiration date"}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Active
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyCoupon(coupon.code)}
                className="mt-5 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Copy Code
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveCoupons;
