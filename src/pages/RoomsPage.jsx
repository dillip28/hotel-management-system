import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RefreshCwIcon, SearchIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { roomsAPI } from "../lib/api.js";

const ROOM_STATUS_CONFIG = {
  VACANT: {
    label: "Vacant",
    color: "text-green-700",
    bg: "bg-green-100 border-green-200",
    dot: "bg-green-500",
  },
  OCCUPIED: {
    label: "Occupied",
    color: "text-blue-700",
    bg: "bg-blue-100 border-blue-200",
    dot: "bg-blue-500",
  },
  DIRTY: {
    label: "Needs Cleaning",
    color: "text-amber-700",
    bg: "bg-amber-100 border-amber-200",
    dot: "bg-amber-500",
  },
  MAINTENANCE: {
    label: "Maintenance",
    color: "text-red-700",
    bg: "bg-red-100 border-red-200",
    dot: "bg-red-500",
  },
  RESERVED: {
    label: "Reserved",
    color: "text-purple-700",
    bg: "bg-purple-100 border-purple-200",
    dot: "bg-purple-500",
  },
};

const ROOM_EMOJI = {
  STANDARD: "🛏️",
  DELUXE: "🌟",
  SUITE: "✨",
  PRESIDENTIAL: "👑",
  PENTHOUSE: "🏙️",
};

export function RoomsPage() {
  const { ui: e, auth: t } = useStore(),
    { darkMode: r } = e,
    [n, l] = useState([]),
    [o, u] = useState([]),
    [d, m] = useState({}),
    [h, g] = useState(true),
    [p, b] = useState(""),
    [S, w] = useState("ALL"),
    [N, j] = useState("ALL"),
    [A, C] = useState("grid"),
    [E, D] = useState(null),
    [P, k] = useState(false);
  (useEffect(() => {
    _();
  }, []),
    useEffect(() => {
      L();
    }, [n, p, S, N]));
  const _ = async () => {
      g(true);
      const [R, $] = await Promise.all([
        roomsAPI.getAll(),
        roomsAPI.getStats(),
      ]);
      (l(R), m($), g(false));
    },
    L = () => {
      let R = [...n];
      (p &&
        (R = R.filter(
          ($) =>
            $.number.includes(p) ||
            $.type.includes(p.toUpperCase()) ||
            $.bedType.toLowerCase().includes(p.toLowerCase()),
        )),
        S !== "ALL" && (R = R.filter(($) => $.status === S)),
        N !== "ALL" && (R = R.filter(($) => $.type === N)),
        u(R));
    },
    M = async (R, $) => {
      k(true);
      try {
        (await roomsAPI.updateStatus(R.id, $, t.userId || "system"),
          await _(),
          D(null),
          toast.success(`Room ${R.number} status updated to ${$}`));
      } catch {
        toast.error("Failed to update room status");
      } finally {
        k(false);
      }
    },
    H = [1, 2, 3, 4, 5],
    X = `rounded-2xl p-5 border ${r ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${r ? "text-white" : "text-gray-900"}`}
        >
          Room Management
        </h1>
        <button
          onClick={_}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <RefreshCwIcon className="w-4 h-4" />
          {" Refresh"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "Total",
            value: d.total,
            color: "from-gray-500 to-slate-600",
          },
          {
            label: "Vacant",
            value: d.vacant,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Occupied",
            value: d.occupied,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Dirty",
            value: d.dirty,
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "Maintenance",
            value: d.maintenance,
            color: "from-red-500 to-rose-600",
          },
        ].map((R) => (
          <div
            className={`rounded-xl p-4 bg-gradient-to-br ${R.color} text-white`}
            key={R.label}
          >
            <p className="text-2xl font-bold">{R.value || 0}</p>
            <p className="text-white/80 text-sm">{R.label}</p>
          </div>
        ))}
      </div>
      <div className={`${X} flex flex-wrap items-center gap-3`}>
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-48 ${r ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
        >
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            value={p}
            onChange={(R) => b(R.target.value)}
            placeholder="Search room number, type..."
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
        <select
          value={S}
          onChange={(R) => w(R.target.value)}
          className={`border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white text-gray-700"}`}
        >
          <option value="ALL">All Status</option>
          {Object.keys(ROOM_STATUS_CONFIG).map((R) => (
            <option value={R} key={R}>
              {ROOM_STATUS_CONFIG[R].label}
            </option>
          ))}
        </select>
        <select
          value={N}
          onChange={(R) => j(R.target.value)}
          className={`border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white text-gray-700"}`}
        >
          <option value="ALL">All Types</option>
          {["STANDARD", "DELUXE", "SUITE", "PRESIDENTIAL", "PENTHOUSE"].map(
            (R) => (
              <option value={R} key={R}>
                {R}
              </option>
            ),
          )}
        </select>
        <div className="flex gap-1 border rounded-xl overflow-hidden">
          <button
            onClick={() => C("grid")}
            className={`px-3 py-2 text-sm ${A === "grid" ? "bg-amber-500 text-white" : r ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600"}`}
          >
            Grid
          </button>
          <button
            onClick={() => C("floor")}
            className={`px-3 py-2 text-sm ${A === "floor" ? "bg-amber-500 text-white" : r ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600"}`}
          >
            Floor
          </button>
        </div>
      </div>
      {h ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : A === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {o.map((R) => {
            const $ = ROOM_STATUS_CONFIG[R.status];
            return (
              <div
                onClick={() => D(R)}
                className={`${X} cursor-pointer hover:shadow-md transition-all border ${E?.id === R.id ? "border-amber-500 ring-2 ring-amber-200" : r ? "border-gray-700" : "border-gray-100"}`}
                key={R.id}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-2xl">{ROOM_EMOJI[R.type]}</span>
                    <h3
                      className={`font-bold text-lg mt-1 ${r ? "text-white" : "text-gray-900"}`}
                    >
                      {"Room "}
                      {R.number}
                    </h3>
                    <p
                      className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {"Floor "}
                      {R.floor}
                      {" • "}
                      {R.type}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${$.bg} ${$.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${$.dot}`} />
                    {$.label}
                  </span>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div
                    className={`flex justify-between text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <span>
                      {"Bed: "}
                      {R.bedType}
                    </span>
                    <span>
                      {R.area}
                      {" m²"}
                    </span>
                  </div>
                  {R.view && (
                    <div
                      className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {"View: "}
                      {R.view}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span
                    className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                  >
                    ₹{R.pricePerNight.toLocaleString()}/night
                  </span>
                  <span
                    className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {"👥 "}
                    {R.maxOccupancy}
                    {" max"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {H.map((R) => {
            const $ = o.filter((J) => J.floor === R);
            return $.length === 0 ? null : (
              <div className={X} key={R}>
                <h3
                  className={`font-bold mb-3 ${r ? "text-white" : "text-gray-900"}`}
                >
                  {"Floor "}
                  {R}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
                  {$.map((J) => {
                    const ie = ROOM_STATUS_CONFIG[J.status];
                    return (
                      <button
                        onClick={() => D(J)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center p-1 border-2 transition-all hover:opacity-80 ${ie.bg} ${E?.id === J.id ? "border-amber-500 ring-2 ring-amber-200" : `border-${ie.dot.split("-")[1]}-200`}`}
                        key={J.id}
                      >
                        <span className="text-lg">{ROOM_EMOJI[J.type]}</span>
                        <span className={`text-xs font-bold ${ie.color}`}>
                          {J.number}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {E && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => D(null)}
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${r ? "bg-gray-800" : "bg-white"}`}
            onClick={(R) => R.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{ROOM_EMOJI[E.type]}</span>
                  <div>
                    <h2
                      className={`text-xl font-bold ${r ? "text-white" : "text-gray-900"}`}
                    >
                      {"Room "}
                      {E.number}
                    </h2>
                    <p
                      className={`text-sm ${r ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {E.type}
                      {" • Floor "}
                      {E.floor}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => D(null)}
                className={`p-1.5 rounded-lg ${r ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Price/Night
                  </p>
                  <p
                    className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                  >
                    ₹{E.pricePerNight.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Max Occupancy
                  </p>
                  <p
                    className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {E.maxOccupancy}
                    {" guests"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Bed Type
                  </p>
                  <p
                    className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {E.bedType}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p
                    className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Area
                  </p>
                  <p
                    className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {E.area}
                    {" m²"}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${r ? "text-gray-400" : "text-gray-500"}`}
                >
                  AMENITIES
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {E.amenities.map((R) => (
                    <span
                      className={`text-xs px-2 py-1 rounded-lg ${r ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}
                      key={R}
                    >
                      {R}
                    </span>
                  ))}
                </div>
              </div>
              {t.role !== "GUEST" && (
                <div>
                  <p
                    className={`text-xs font-medium mb-2 ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    CHANGE STATUS
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(ROOM_STATUS_CONFIG).map((R) => (
                      <button
                        onClick={() => M(E, R)}
                        disabled={E.status === R || P}
                        className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${E.status === R ? `${ROOM_STATUS_CONFIG[R].bg} ${ROOM_STATUS_CONFIG[R].color} border-current` : r ? "border-gray-600 text-gray-400 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"} disabled:opacity-60`}
                        key={R}
                      >
                        {ROOM_STATUS_CONFIG[R].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {E.lastCleaned && (
              <p className={`text-xs ${r ? "text-gray-500" : "text-gray-400"}`}>
                {"Last cleaned: "}
                {new Date(E.lastCleaned).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
