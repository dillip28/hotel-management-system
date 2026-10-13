import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../store/useStore.js";
import { ledgerAPI, reportsAPI } from "../lib/api.js";

const ANALYTICS_CHART_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
];

export function AnalyticsPage() {
  const { ui: e } = useStore(),
    { darkMode: t } = e,
    [r, n] = useState(null),
    [l, o] = useState(null),
    [u, d] = useState([]),
    [m, h] = useState(true),
    [g, p] = useState("daily");
  (useEffect(() => {
    b();
  }, []),
    useEffect(() => {
      S();
    }, [g]));
  const b = async () => {
      h(true);
      const [A, C] = await Promise.all([
        reportsAPI.getDashboard(),
        ledgerAPI.getStats(),
      ]);
      (n(A), o(C), h(false));
    },
    S = async () => {
      const A = await reportsAPI.getRevenueReport(g);
      d(A);
    },
    w = `rounded-2xl border p-5 ${t ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  if (m)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  const { summary: N, charts: j } = r || { summary: {}, charts: {} };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${t ? "text-white" : "text-gray-900"}`}
        >
          {"Analytics & Reports"}
        </h1>
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((A) => (
            <button
              onClick={() => p(A)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize ${g === A ? "bg-amber-500 text-white" : t ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
              key={A}
            >
              {A}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${(N.totalRevenue || 0).toLocaleString()}`,
            color: "text-green-600",
            bg: t ? "bg-green-900/20" : "bg-green-50",
          },
          {
            label: "Occupancy Rate",
            value: `${N.occupancyRate || 0}%`,
            color: "text-amber-600",
            bg: t ? "bg-amber-900/20" : "bg-amber-50",
          },
          {
            label: "ADR",
            value: `₹${(N.adr || 0).toLocaleString()}`,
            color: "text-blue-600",
            bg: t ? "bg-blue-900/20" : "bg-blue-50",
          },
          {
            label: "RevPAR",
            value: `₹${(N.revpar || 0).toLocaleString()}`,
            color: "text-purple-600",
            bg: t ? "bg-purple-900/20" : "bg-purple-50",
          },
        ].map((A) => (
          <div className={`${w} ${A.bg}`} key={A.label}>
            <p className={`text-2xl font-bold ${A.color}`}>{A.value}</p>
            <p
              className={`text-sm mt-1 ${t ? "text-gray-400" : "text-gray-500"}`}
            >
              {A.label}
            </p>
          </div>
        ))}
      </div>
      <div className={w}>
        <h3 className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}>
          Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={u.slice(-14)}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={t ? "#374151" : "#f3f4f6"}
            />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 10, fill: t ? "#9ca3af" : "#6b7280" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: t ? "#9ca3af" : "#6b7280" }}
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
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f59e0b"
              fill="url(#revGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={w}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            Room Type Performance
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={j.roomTypeData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={t ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="type"
                tick={{ fontSize: 10, fill: t ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis tick={{ fontSize: 10, fill: t ? "#9ca3af" : "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  background: t ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar
                dataKey="total"
                fill={t ? "#374151" : "#e5e7eb"}
                name="Total"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="occupied"
                fill="#f59e0b"
                name="Occupied"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={w}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            Booking Sources
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={j.bookingSources || []}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {(j.bookingSources || []).map((A, C) => (
                  <Cell
                    fill={
                      ANALYTICS_CHART_COLORS[C % ANALYTICS_CHART_COLORS.length]
                    }
                    key={C}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: t ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                }}
              />
              <Legend
                formatter={(A) => (
                  <span
                    style={{
                      color: t ? "#d1d5db" : "#374151",
                      fontSize: 11,
                    }}
                  >
                    {A}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {l?.monthlyData && (
        <div className={w}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            {"Profit & Loss Analysis"}
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div
              className={`p-3 rounded-xl text-center ${t ? "bg-green-900/20" : "bg-green-50"}`}
            >
              <p className="text-xl font-bold text-green-600">
                ₹{(l.totalIncome || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total Income</p>
            </div>
            <div
              className={`p-3 rounded-xl text-center ${t ? "bg-red-900/20" : "bg-red-50"}`}
            >
              <p className="text-xl font-bold text-red-600">
                ₹{(l.totalExpenses || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total Expenses</p>
            </div>
            <div
              className={`p-3 rounded-xl text-center ${t ? "bg-blue-900/20" : "bg-blue-50"}`}
            >
              <p className="text-xl font-bold text-blue-600">
                ₹{(l.netProfit || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Net Profit ({l.profitMargin || 0}%)
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={l.monthlyData.slice(-6)}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={t ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: t ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: t ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(A) => `₹${(A / 1e3).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: t ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                }}
                formatter={(A) => [`₹${Number(A).toLocaleString()}`]}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
              <Bar
                dataKey="profit"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
