import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CircleAlertIcon, EyeIcon, EyeOffIcon, HotelIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { authAPI } from "../lib/auth.js";

const DEMO_ACCOUNTS = [
  {
    role: "Super Admin",
    email: "admin@auralis.com",
    password: "Admin@123",
    color: "from-rose-500 to-pink-600",
  },
  {
    role: "Hotel Admin",
    email: "manager@auralis.com",
    password: "Manager@123",
    color: "from-purple-500 to-indigo-600",
  },
  {
    role: "Receptionist",
    email: "reception@auralis.com",
    password: "Reception@123",
    color: "from-blue-500 to-cyan-600",
  },
  {
    role: "Accountant",
    email: "accounts@auralis.com",
    password: "Accounts@123",
    color: "from-green-500 to-emerald-600",
  },
  {
    role: "Housekeeping",
    email: "housekeeping@auralis.com",
    password: "House@123",
    color: "from-amber-500 to-orange-600",
  },
  {
    role: "Guest",
    email: "guest@example.com",
    password: "Guest@123",
    color: "from-slate-500 to-gray-600",
  },
];

export function LoginPage() {
  const e = useNavigate(),
    { setAuth: t } = useStore(),
    [r, n] = useState(""),
    [l, o] = useState(""),
    [u, d] = useState(false),
    [m, h] = useState(false),
    [g, p] = useState(""),
    b = async (w) => {
      if ((w.preventDefault(), !r || !l)) {
        p("Please enter your email and password");
        return;
      }
      (h(true), p(""));
      try {
        const N = await authAPI.login({ email: r, password: l });
        N.success && N.user
          ? (t({
              userId: N.user.id,
              email: N.user.email,
              name: N.user.name,
              role: N.user.role,
            }),
            toast.success(`Welcome back, ${N.user.name}! 👋`),
            N.user.role === "GUEST" ? e("/my-bookings") : e("/dashboard"))
          : p(N.error || "Login failed");
      } finally {
        h(false);
      }
    },
    S = async (w) => {
      (n(w.email), o(w.password), h(true), p(""));
      try {
        const N = await authAPI.login(w);
        N.success &&
          N.user &&
          (t({
            userId: N.user.id,
            email: N.user.email,
            name: N.user.name,
            role: N.user.role,
          }),
          toast.success(`Logged in as ${N.user.role.replace("_", " ")}`),
          N.user.role === "GUEST" ? e("/my-bookings") : e("/dashboard"));
      } catch {
        p("Login failed");
      } finally {
        h(false);
      }
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <HotelIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Auralis</h1>
            <p className="text-amber-300/70 text-xs">Enterprise Hotel ERP</p>
          </div>
        </div>
        <div className="relative">
          <h2
            className="text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Complete Hotel
            <br />
            Management
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              at Your Fingertips
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Manage bookings, rooms, staff, finances, and smart automation all
            from one powerful platform.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { label: "Rooms Managed", value: "38+" },
              { label: "Daily Bookings", value: "50+" },
              { label: "Revenue Tracked", value: "₹50L+" },
              { label: "Staff Members", value: "45+" },
            ].map((w) => (
              <div
                className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10"
                key={w.label}
              >
                <p className="text-2xl font-bold text-white">{w.value}</p>
                <p className="text-gray-400 text-sm">{w.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-sm relative">
          © 2024 Auralis Hotel Management System
        </p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <HotelIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white font-bold text-xl">Auralis</h1>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-gray-500 mb-6">Sign in to your account</p>
            {g && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
                <CircleAlertIcon className="w-4 h-4 flex-shrink-0" />
                {g}
              </div>
            )}
            <form onSubmit={b} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={r}
                  onChange={(w) => n(w.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={u ? "text" : "password"}
                    value={l}
                    onChange={(w) => o(w.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => d(!u)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {u ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={m}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-70 transition-opacity flex items-center justify-center gap-2"
              >
                {m && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Sign In
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-amber-600 font-medium hover:text-amber-700"
              >
                Create account
              </Link>
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3 font-medium">
                Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((w) => (
                  <button
                    onClick={() => S(w)}
                    disabled={m}
                    className={`text-left p-2.5 rounded-xl bg-gradient-to-r ${w.color} text-white hover:opacity-90 transition-opacity disabled:opacity-50`}
                    key={w.role}
                  >
                    <p className="text-xs font-semibold">{w.role}</p>
                    <p className="text-xs opacity-75 truncate">{w.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
