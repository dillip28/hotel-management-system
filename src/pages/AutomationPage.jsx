import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import {
  LightbulbIcon,
  LockIcon,
  RefreshCwIcon,
  ThermometerIcon,
  TvIcon,
  WindIcon,
  ZapIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { devicesAPI, energyAPI, roomsAPI } from "../lib/api.js";

const DEVICE_ICONS = {
  LIGHT: LightbulbIcon,
  HVAC: ThermometerIcon,
  TV: TvIcon,
  LOCK: LockIcon,
  CURTAIN: WindIcon,
  SENSOR: ZapIcon,
  MINIBAR: ZapIcon,
};

const DEVICE_COLORS = {
  LIGHT: "text-amber-500",
  HVAC: "text-blue-500",
  TV: "text-purple-500",
  LOCK: "text-green-500",
  CURTAIN: "text-slate-500",
  SENSOR: "text-orange-500",
};

export function AutomationPage() {
  const { ui: e } = useStore(),
    { darkMode: t } = e,
    [r, n] = useState([]),
    [l, o] = useState({}),
    [u, d] = useState([]),
    [m, h] = useState(""),
    [g, p] = useState({}),
    [b, S] = useState(true);
  (useEffect(() => {
    w();
    const _ = setInterval(j, 5e3);
    return () => clearInterval(_);
  }, []),
    useEffect(() => {
      m && N();
    }, [m]));
  const w = async () => {
      S(true);
      const [_, L, M] = await Promise.all([
        devicesAPI.getAll(),
        energyAPI.getStats(),
        roomsAPI.getAll(),
      ]);
      (n(_),
        o(L),
        d(M.filter((H) => ["OCCUPIED", "RESERVED"].includes(H.status))),
        M.length > 0 &&
          h(M.find((H) => H.status === "OCCUPIED")?.id || M[0].id),
        S(false));
    },
    N = async () => {
      if (!m) return;
      const _ = devicesAPI.simulateSensorData(m);
      p((L) => ({ ...L, [m]: _ }));
    },
    j = () => {
      u.forEach((_) => {
        const L = devicesAPI.simulateSensorData(_.id);
        p((M) => ({ ...M, [_.id]: L }));
      });
    },
    A = async (_, L) => {
      await devicesAPI.toggle(_, !L);
      const M = r.map((H) => (H.id === _ ? { ...H, isOn: !L } : H));
      (n(M), toast.success(`Device ${L ? "turned off" : "turned on"}`));
    },
    C = async (_, L) => {
      await devicesAPI.setValue(_, L);
      const M = r.map((H) => (H.id === _ ? { ...H, value: L } : H));
      n(M);
    },
    E = r.filter((_) => _.roomId === m),
    D = g[m],
    P = u.find((_) => _.id === m),
    k = `rounded-2xl border p-5 ${t ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${t ? "text-white" : "text-gray-900"}`}
        >
          Smart Automation
        </h1>
        <button
          onClick={w}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <RefreshCwIcon className="w-4 h-4" />
          {" Refresh"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "30-Day Usage",
            value: `${l.totalKwh?.toFixed(0) || 0} kWh`,
            icon: "⚡",
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Avg Daily",
            value: `${l.avgDailyKwh || 0} kWh`,
            icon: "📊",
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Total Cost",
            value: `₹${(l.totalCost || 0).toLocaleString()}`,
            icon: "💰",
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "CO₂ Saved",
            value: `${l.co2Saved || 0} kg`,
            icon: "🌱",
            color: "from-emerald-500 to-teal-600",
          },
        ].map((_) => (
          <div
            className={`rounded-xl p-4 bg-gradient-to-br ${_.color} text-white`}
            key={_.label}
          >
            <span className="text-2xl">{_.icon}</span>
            <p className="text-xl font-bold mt-1">{_.value}</p>
            <p className="text-white/80 text-sm">{_.label}</p>
          </div>
        ))}
      </div>
      {l.chartData && (
        <div className={k}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            Energy Consumption (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={l.chartData.slice(-14)}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={t ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="date"
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
              <Area
                type="monotone"
                dataKey="electricity"
                stroke="#f59e0b"
                fill="url(#energyGrad)"
                strokeWidth={2}
                name="kWh"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={k}>
          <h3
            className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
          >
            Occupied Rooms
          </h3>
          <div className="space-y-2">
            {u.length === 0 ? (
              <p className={`text-sm ${t ? "text-gray-500" : "text-gray-400"}`}>
                No occupied rooms
              </p>
            ) : (
              u.map((_) => (
                <button
                  onClick={() => h(_.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${m === _.id ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20" : t ? "border-gray-700 hover:border-gray-600" : "border-gray-100 hover:border-gray-200"}`}
                  key={_.id}
                >
                  <div className="text-left">
                    <p
                      className={`font-semibold text-sm ${t ? "text-white" : "text-gray-900"}`}
                    >
                      {"Room "}
                      {_.number}
                    </p>
                    <p
                      className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {_.type}
                      {" • Floor "}
                      {_.floor}
                    </p>
                  </div>
                  {g[_.id] && (
                    <div className="text-right text-xs">
                      <p className={t ? "text-gray-300" : "text-gray-700"}>
                        {g[_.id].temperature?.toFixed(1)}°C
                      </p>
                      <p
                        className={`${g[_.id].occupancy ? "text-green-500" : "text-gray-400"}`}
                      >
                        {g[_.id].occupancy ? "● Occupied" : "○ Vacant"}
                      </p>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="xl:col-span-2 space-y-4">
          {D && P && (
            <div className={k}>
              <h3
                className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
              >
                {"Room "}
                {P.number}
                {" — Live Sensors"}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Temperature",
                    value: `${D.temperature?.toFixed(1)}°C`,
                    color: "from-red-400 to-orange-500",
                    icon: "🌡️",
                  },
                  {
                    label: "Humidity",
                    value: `${D.humidity?.toFixed(0)}%`,
                    color: "from-blue-400 to-cyan-500",
                    icon: "💧",
                  },
                  {
                    label: "CO₂",
                    value: `${D.co2Level?.toFixed(0)} ppm`,
                    color: "from-green-400 to-emerald-500",
                    icon: "🌿",
                  },
                ].map((_) => (
                  <div
                    className={`rounded-xl p-3 bg-gradient-to-br ${_.color} text-white text-center`}
                    key={_.label}
                  >
                    <span className="text-2xl">{_.icon}</span>
                    <p className="text-lg font-bold mt-1">{_.value}</p>
                    <p className="text-white/80 text-xs">{_.label}</p>
                  </div>
                ))}
              </div>
              <div
                className={`mt-3 p-3 rounded-xl text-center ${D.occupancy ? "bg-green-100" : t ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <p
                  className={`font-semibold text-sm ${D.occupancy ? "text-green-700" : t ? "text-gray-400" : "text-gray-500"}`}
                >
                  {D.occupancy
                    ? "🟢 Room Occupied - Smart controls active"
                    : "⚪ Room Vacant - Energy saving mode"}
                </p>
              </div>
            </div>
          )}
          <div className={k}>
            <h3
              className={`font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
            >
              {P ? `Room ${P.number} — Device Controls` : "Device Controls"}
            </h3>
            {E.length === 0 ? (
              <p
                className={`text-sm text-center py-8 ${t ? "text-gray-500" : "text-gray-400"}`}
              >
                No devices configured for this room
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {E.map((_) => {
                  const L = DEVICE_ICONS[_.type] || ZapIcon,
                    M = DEVICE_COLORS[_.type] || "text-gray-500";
                  return (
                    <div
                      className={`p-4 rounded-xl border ${t ? "border-gray-700 bg-gray-750" : "border-gray-100 bg-gray-50"}`}
                      key={_.id}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <L className={`w-5 h-5 ${M}`} />
                          <span
                            className={`font-medium text-sm ${t ? "text-white" : "text-gray-900"}`}
                          >
                            {_.name}
                          </span>
                        </div>
                        <button
                          onClick={() => A(_.id, _.isOn)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${_.isOn ? "bg-amber-500" : t ? "bg-gray-600" : "bg-gray-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${_.isOn ? "translate-x-6" : "translate-x-0.5"}`}
                          />
                        </button>
                      </div>
                      {_.value !== undefined && _.isOn && (
                        <div>
                          <input
                            type="range"
                            min={_.type === "HVAC" ? 16 : 0}
                            max={_.type === "HVAC" ? 30 : 100}
                            value={_.value}
                            onChange={(H) => C(_.id, Number(H.target.value))}
                            className="w-full h-1.5 accent-amber-500"
                          />
                          <p
                            className={`text-xs text-center mt-1 ${t ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {_.value}
                            {_.unit}
                          </p>
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${t ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {_.automationEnabled ? "🤖 Auto" : "✋ Manual"}
                        {" • "}
                        {_.type}
                      </p>
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
}
