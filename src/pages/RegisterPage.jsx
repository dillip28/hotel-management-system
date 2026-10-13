import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CheckIcon,
  CircleAlertIcon,
  EyeIcon,
  EyeOffIcon,
  HotelIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { authAPI } from "../lib/auth.js";

export function RegisterPage() {
  const e = useNavigate(),
    { setAuth: t } = useStore(),
    [r, n] = useState(""),
    [l, o] = useState(""),
    [u, d] = useState(""),
    [m, h] = useState(""),
    [g, p] = useState(""),
    [b, S] = useState(false),
    [w, N] = useState(false),
    [j, A] = useState(""),
    C = () => {
      let _ = 0;
      return (
        m.length >= 6 && _++,
        /[A-Z]/.test(m) && _++,
        /[0-9]/.test(m) && _++,
        /[^A-Za-z0-9]/.test(m) && _++,
        _
      );
    },
    E = ["", "Weak", "Fair", "Good", "Strong"],
    D = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-400"],
    P = async (_) => {
      if ((_.preventDefault(), !r || !l || !m)) {
        A("Please fill in all required fields");
        return;
      }
      if (m !== g) {
        A("Passwords do not match");
        return;
      }
      if (m.length < 6) {
        A("Password must be at least 6 characters");
        return;
      }
      (N(true), A(""));
      try {
        const L = await authAPI.register({
          name: r,
          email: l,
          password: m,
          phone: u,
        });
        if (L.success && L.user) {
          (t({
            userId: L.user.id,
            email: L.user.email,
            name: L.user.name,
            role: L.user.role,
          }),
            toast.success(`Welcome to Auralis, ${L.user.name}! 🎉`));
          const M = sessionStorage.getItem("booking_intent");
          if (M) {
            const { roomId: H, checkIn: X, checkOut: R } = JSON.parse(M);
            (sessionStorage.removeItem("booking_intent"),
              e(`/book/${H}?checkIn=${X}&checkOut=${R}`));
          } else e("/my-bookings");
        } else A(L.error || "Registration failed");
      } finally {
        N(false);
      }
    },
    k = C();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <HotelIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-bold text-2xl">Auralis</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create Account
          </h2>
          <p className="text-gray-500 mb-6">
            Join Auralis for a luxurious experience
          </p>
          {j && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
              <CircleAlertIcon className="w-4 h-4 flex-shrink-0" />
              {j}
            </div>
          )}
          <form onSubmit={P} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                value={r}
                onChange={(_) => n(_.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={l}
                onChange={(_) => o(_.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                value={u}
                onChange={(_) => d(_.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={b ? "text" : "password"}
                  value={m}
                  onChange={(_) => h(_.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => S(!b)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {b ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
              {m && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((_) => (
                      <div
                        className={`h-1 flex-1 rounded-full transition-colors ${_ <= k ? D[k] : "bg-gray-200"}`}
                        key={_}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {E[k] || "Too short"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={g}
                  onChange={(_) => p(_.target.value)}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
                {g && m === g && (
                  <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={w}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-70 transition-opacity flex items-center justify-center gap-2 mt-2"
            >
              {w && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 font-medium hover:text-amber-700"
            >
              Sign in
            </Link>
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            🎁 New members receive 100 loyalty points on registration!
          </div>
        </div>
      </div>
    </div>
  );
}
