import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CreditCardIcon,
  IndianRupeeIcon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { paymentsAPI } from "../lib/api.js";

const PAYMENT_METHOD_ICONS = {
  CARD: "💳",
  CASH: "💵",
  UPI: "📱",
  GPAY: "🟦",
  PHONEPE: "🟣",
  PAYTM: "🔵",
  BANK_TRANSFER: "🏦",
  SPLIT: "✂️",
};

export function PaymentsPage() {
  const { ui: e } = useStore(),
    { darkMode: t } = e,
    [r, n] = useState([]),
    [l, o] = useState({}),
    [u, d] = useState(true),
    [m, h] = useState(""),
    [g, p] = useState("ALL");
  useEffect(() => {
    b();
  }, []);
  const b = async () => {
      d(true);
      const [A, C] = await Promise.all([
        paymentsAPI.getAll(),
        paymentsAPI.getStats(),
      ]);
      (n(A), o(C), d(false));
    },
    S = r.filter(
      (A) =>
        !(
          (m &&
            !A.transactionId?.includes(m) &&
            !A.booking?.bookingNumber
              ?.toLowerCase()
              .includes(m.toLowerCase()) &&
            !A.guest?.name?.toLowerCase().includes(m.toLowerCase())) ||
          (g !== "ALL" && A.method !== g)
        ),
    ),
    w = Object.entries(l.byMethod || {}).map(([A, C]) => ({
      method: A,
      amount: Number(C),
    })),
    N = `rounded-2xl border p-5 ${t ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`,
    j = {
      COMPLETED: "bg-green-100 text-green-700",
      PENDING: "bg-amber-100 text-amber-700",
      FAILED: "bg-red-100 text-red-700",
      REFUNDED: "bg-purple-100 text-purple-700",
      PARTIAL: "bg-blue-100 text-blue-700",
    };
  return (
    <div className="space-y-6">
      <h1
        className={`text-2xl font-bold ${t ? "text-white" : "text-gray-900"}`}
      >
        Payment Management
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${(l.totalRevenue || 0).toLocaleString()}`,
            icon: IndianRupeeIcon,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Today's Revenue",
            value: `₹${(l.todayRevenue || 0).toLocaleString()}`,
            icon: TrendingUpIcon,
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Total Transactions",
            value: l.totalTransactions || 0,
            icon: CreditCardIcon,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Today's Transactions",
            value: l.todayTransactions || 0,
            icon: CreditCardIcon,
            color: "from-purple-500 to-violet-600",
          },
        ].map((A) => {
          const C = A.icon;
          return (
            <div
              className={`rounded-xl p-4 bg-gradient-to-br ${A.color} text-white`}
              key={A.label}
            >
              <C className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-2xl font-bold">{A.value}</p>
              <p className="text-white/80 text-sm mt-1">{A.label}</p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className={`xl:col-span-2 ${N}`}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            Revenue by Payment Method
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={w}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={t ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="method"
                tick={{ fontSize: 11, fill: t ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: t ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(A) => `₹${(A / 1e3).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: t ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                }}
                formatter={(A) => [`₹${Number(A).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={N}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            By Method
          </h3>
          <div className="space-y-2">
            {w.map((A) => (
              <div
                className={`flex items-center justify-between p-2.5 rounded-xl ${t ? "bg-gray-700" : "bg-gray-50"}`}
                key={A.method}
              >
                <span className="flex items-center gap-2 text-sm">
                  <span>{PAYMENT_METHOD_ICONS[A.method] || "💰"}</span>
                  <span className={t ? "text-gray-300" : "text-gray-700"}>
                    {A.method}
                  </span>
                </span>
                <span
                  className={`font-bold text-sm ${t ? "text-white" : "text-gray-900"}`}
                >
                  ₹{A.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`${N} flex flex-wrap gap-3`}>
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-48 ${t ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
        >
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            value={m}
            onChange={(A) => h(A.target.value)}
            placeholder="Search transaction, booking..."
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
        <select
          value={g}
          onChange={(A) => p(A.target.value)}
          className={`border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
        >
          <option value="ALL">All Methods</option>
          {Object.keys(PAYMENT_METHOD_ICONS).map((A) => (
            <option value={A} key={A}>
              {A}
            </option>
          ))}
        </select>
      </div>
      <div className={N}>
        {u ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${t ? "border-gray-700" : "border-gray-100"}`}
                >
                  {[
                    "Transaction ID",
                    "Booking",
                    "Guest",
                    "Amount",
                    "Method",
                    "Status",
                    "Date",
                  ].map((A) => (
                    <th
                      className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide ${t ? "text-gray-400" : "text-gray-500"}`}
                      key={A}
                    >
                      {A}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {S.map((A) => (
                  <tr
                    className={`border-b ${t ? "border-gray-700" : "border-gray-50"}`}
                    key={A.id}
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs text-amber-600">
                        {A.transactionId || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">
                      {A.booking?.bookingNumber || "-"}
                    </td>
                    <td className="py-3 px-3">
                      <p
                        className={`font-medium text-sm ${t ? "text-white" : "text-gray-900"}`}
                      >
                        {A.guest?.name || "-"}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <p
                        className={`font-bold ${t ? "text-white" : "text-gray-900"}`}
                      >
                        ₹{A.amount?.toLocaleString()}
                      </p>
                      {A.refundAmount && (
                        <p className="text-xs text-red-500">
                          Refund: -₹{A.refundAmount.toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-sm">
                        <span>{PAYMENT_METHOD_ICONS[A.method] || "💰"}</span>
                        <span className={t ? "text-gray-300" : "text-gray-700"}>
                          {A.method}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${j[A.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {A.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {A.paidAt
                        ? new Date(A.paidAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
