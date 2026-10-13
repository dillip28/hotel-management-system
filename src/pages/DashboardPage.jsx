import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  ActivityIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BedDoubleIcon,
  CircleCheckBigIcon,
  ClockIcon,
  IndianRupeeIcon,
  SparklesIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { reportsAPI } from "../lib/api.js";

const DASHBOARD_CHART_COLORS = [
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#3b82f6",
  "#f97316",
];

export function DashboardPage() {
  const e = useNavigate(),
    { ui: t } = useStore(),
    { darkMode: r } = t,
    [n, l] = useState(null),
    [o, u] = useState(true),
    [d, m] = useState(new Date());
  useEffect(() => {
    h();
    const w = setInterval(() => {
      m(new Date());
    }, 1e3);
    return () => clearInterval(w);
  }, []);
  const h = async () => {
      u(true);
      try {
        const w = await reportsAPI.getDashboard();
        l(w);
      } finally {
        u(false);
      }
    },
    g = (w) =>
      `rounded-2xl p-5 border ${w ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  if (o)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className={r ? "text-gray-400" : "text-gray-500"}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  const { summary: p, charts: b } = n || { summary: {}, charts: {} },
    S = [
      {
        label: "Today's Revenue",
        value: `₹${(p.todayRevenue || 0).toLocaleString()}`,
        sub: `Monthly: ₹${(p.monthlyRevenue || 0).toLocaleString()}`,
        icon: IndianRupeeIcon,
        gradient: "from-green-500 to-emerald-600",
        trend: "+12.5%",
        up: true,
      },
      {
        label: "Occupancy Rate",
        value: `${p.occupancyRate || 0}%`,
        sub: `${p.occupiedRooms || 0} of ${p.totalRooms || 0} rooms`,
        icon: BedDoubleIcon,
        gradient: "from-amber-500 to-orange-500",
        trend: "+3.2%",
        up: true,
      },
      {
        label: "Active Guests",
        value: p.activeBookings || 0,
        sub: `${p.pendingCheckIns || 0} due today`,
        icon: UsersIcon,
        gradient: "from-blue-500 to-indigo-600",
        trend: "-1",
        up: false,
      },
      {
        label: "ADR",
        value: `₹${(p.adr || 0).toLocaleString()}`,
        sub: `RevPAR: ₹${(p.revpar || 0).toLocaleString()}`,
        icon: TrendingUpIcon,
        gradient: "from-purple-500 to-violet-600",
        trend: "+8.1%",
        up: true,
      },
    ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${r ? "text-white" : "text-gray-900"}`}
          >
            Dashboard
          </h1>
          <p className={`text-sm ${r ? "text-gray-400" : "text-gray-500"}`}>
            {d.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" • "}
            {d.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <button
          onClick={h}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          <ActivityIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>
      {(p.maintenanceAlerts > 0 || p.housekeepingPending > 0) && (
        <div
          className={`rounded-xl p-4 border flex items-center gap-3 ${r ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200"}`}
        >
          <TriangleAlertIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex gap-4 text-sm">
            {p.maintenanceAlerts > 0 && (
              <button
                onClick={() => e("/maintenance")}
                className="text-amber-700 font-medium hover:underline"
              >
                {"🔧 "}
                {p.maintenanceAlerts}
                {" maintenance alert"}
                {p.maintenanceAlerts !== 1 ? "s" : ""}
              </button>
            )}
            {p.housekeepingPending > 0 && (
              <button
                onClick={() => e("/housekeeping")}
                className="text-amber-700 font-medium hover:underline"
              >
                {"🧹 "}
                {p.housekeepingPending}
                {" housekeeping task"}
                {p.housekeepingPending !== 1 ? "s" : ""}
                {" pending"}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {S.map((w) => {
          const N = w.icon;
          return (
            <div className={g(r)} key={w.label}>
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${w.gradient} flex items-center justify-center`}
                >
                  <N className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`text-xs font-semibold flex items-center gap-1 ${w.up ? "text-green-500" : "text-red-500"}`}
                >
                  {w.up ? (
                    <ArrowUpRightIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownRightIcon className="w-3 h-3" />
                  )}
                  {w.trend}
                </span>
              </div>
              <p
                className={`text-2xl font-bold mb-1 ${r ? "text-white" : "text-gray-900"}`}
              >
                {w.value}
              </p>
              <p className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}>
                {w.label}
              </p>
              <p
                className={`text-xs mt-0.5 ${r ? "text-gray-500" : "text-gray-400"}`}
              >
                {w.sub}
              </p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Check In Guest",
            action: "/reception",
            icon: "🏨",
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "New Booking",
            action: "/bookings",
            icon: "📅",
            color: "from-green-500 to-green-600",
          },
          {
            label: "Room Status",
            action: "/rooms",
            icon: "🛏️",
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Add Payment",
            action: "/payments",
            icon: "💳",
            color: "from-purple-500 to-violet-600",
          },
        ].map((w) => (
          <button
            onClick={() => e(w.action)}
            className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${w.color} text-white hover:opacity-90 transition-opacity shadow-sm`}
            key={w.label}
          >
            <span className="text-2xl">{w.icon}</span>
            <span className="font-semibold text-sm">{w.label}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className={`xl:col-span-2 ${g(r)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold ${r ? "text-white" : "text-gray-900"}`}>
              Revenue (Last 14 Days)
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${r ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700"}`}
            >
              Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={b.revenueChart || []}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={r ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: r ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: r ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(w) => `₹${(w / 1e3).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(w) => [`₹${w.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  background: r ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: r ? "#f9fafb" : "#111827" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                fill="url(#revenueGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={g(r)}>
          <h3
            className={`font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
          >
            Booking Sources
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={b.bookingSources || []}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {(b.bookingSources || []).map((w, N) => (
                  <Cell
                    fill={
                      DASHBOARD_CHART_COLORS[N % DASHBOARD_CHART_COLORS.length]
                    }
                    key={N}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: r ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                }}
                labelStyle={{ color: r ? "#f9fafb" : "#111827" }}
              />
              <Legend
                formatter={(w) => (
                  <span
                    style={{
                      color: r ? "#d1d5db" : "#374151",
                      fontSize: 11,
                    }}
                  >
                    {w}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={g(r)}>
          <h3
            className={`font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
          >
            Room Type Occupancy
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={b.roomTypeData || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={r ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="type"
                tick={{ fontSize: 10, fill: r ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis tick={{ fontSize: 10, fill: r ? "#9ca3af" : "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  background: r ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="total"
                fill={r ? "#374151" : "#f3f4f6"}
                radius={[4, 4, 0, 0]}
                name="Total"
              />
              <Bar
                dataKey="occupied"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                name="Occupied"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={g(r)}>
          <h3
            className={`font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
          >
            Today's Activity
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Pending Check-ins",
                value: p.pendingCheckIns || 0,
                icon: ClockIcon,
                color: "text-blue-500",
                bg: r ? "bg-blue-900/20" : "bg-blue-50",
                action: () => e("/reception"),
              },
              {
                label: "Pending Check-outs",
                value: p.pendingCheckOuts || 0,
                icon: CircleCheckBigIcon,
                color: "text-green-500",
                bg: r ? "bg-green-900/20" : "bg-green-50",
                action: () => e("/reception"),
              },
              {
                label: "Rooms to Clean",
                value: p.housekeepingPending || 0,
                icon: SparklesIcon,
                color: "text-amber-500",
                bg: r ? "bg-amber-900/20" : "bg-amber-50",
                action: () => e("/housekeeping"),
              },
              {
                label: "Maintenance Issues",
                value: p.maintenanceAlerts || 0,
                icon: WrenchIcon,
                color: "text-red-500",
                bg: r ? "bg-red-900/20" : "bg-red-50",
                action: () => e("/maintenance"),
              },
              {
                label: "Vacant Rooms",
                value: p.vacantRooms || 0,
                icon: BedDoubleIcon,
                color: "text-purple-500",
                bg: r ? "bg-purple-900/20" : "bg-purple-50",
                action: () => e("/rooms"),
              },
              {
                label: "Active Guests",
                value: p.activeBookings || 0,
                icon: UsersIcon,
                color: "text-indigo-500",
                bg: r ? "bg-indigo-900/20" : "bg-indigo-50",
                action: () => e("/guests"),
              },
            ].map((w) => {
              const N = w.icon;
              return (
                <button
                  onClick={w.action}
                  className={`w-full flex items-center justify-between p-3 rounded-xl ${w.bg} hover:opacity-80 transition-opacity`}
                  key={w.label}
                >
                  <div className="flex items-center gap-3">
                    <N className={`w-4 h-4 ${w.color}`} />
                    <span
                      className={`text-sm font-medium ${r ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {w.label}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${w.color}`}>
                    {w.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className={g(r)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${r ? "text-white" : "text-gray-900"}`}>
            Room Status Overview
          </h3>
          <button
            onClick={() => e("/rooms")}
            className="text-amber-500 hover:text-amber-600 text-sm font-medium"
          >
            View All Rooms →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            {
              status: "VACANT",
              label: "Vacant",
              color: "bg-green-100 text-green-700 border-green-200",
              count: p.vacantRooms,
            },
            {
              status: "OCCUPIED",
              label: "Occupied",
              color: "bg-blue-100 text-blue-700 border-blue-200",
              count: p.occupiedRooms,
            },
            {
              status: "DIRTY",
              label: "Dirty",
              color: "bg-amber-100 text-amber-700 border-amber-200",
              count:
                p.totalRooms -
                p.vacantRooms -
                p.occupiedRooms -
                (p.maintenanceAlerts || 0) -
                (p.pendingCheckIns || 0),
            },
            {
              status: "MAINTENANCE",
              label: "Maintenance",
              color: "bg-red-100 text-red-700 border-red-200",
              count: p.maintenanceAlerts,
            },
          ].map((w) => (
            <div
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${w.color}`}
              key={w.status}
            >
              {w.label}
              {": "}
              {Math.max(0, w.count || 0)}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-10 gap-1.5">
          {[
            "101",
            "102",
            "103",
            "104",
            "105",
            "201",
            "202",
            "203",
            "204",
            "205",
            "301",
            "302",
            "303",
            "304",
            "401",
            "402",
            "403",
            "501",
            "502",
          ].map((w) => {
            const j =
                {
                  102: "OCCUPIED",
                  103: "DIRTY",
                  104: "MAINTENANCE",
                  202: "OCCUPIED",
                  203: "RESERVED",
                  301: "OCCUPIED",
                  303: "OCCUPIED",
                  402: "OCCUPIED",
                  502: "OCCUPIED",
                }[w] || "VACANT",
              A = {
                VACANT: r
                  ? "bg-green-900/40 text-green-400"
                  : "bg-green-100 text-green-700",
                OCCUPIED: r
                  ? "bg-blue-900/40 text-blue-400"
                  : "bg-blue-100 text-blue-700",
                DIRTY: r
                  ? "bg-amber-900/40 text-amber-400"
                  : "bg-amber-100 text-amber-700",
                MAINTENANCE: r
                  ? "bg-red-900/40 text-red-400"
                  : "bg-red-100 text-red-700",
                RESERVED: r
                  ? "bg-purple-900/40 text-purple-400"
                  : "bg-purple-100 text-purple-700",
              };
            return (
              <div
                onClick={() => e("/rooms")}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-80 ${A[j]}`}
                title={`Room ${w} - ${j}`}
                key={w}
              >
                {w}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
