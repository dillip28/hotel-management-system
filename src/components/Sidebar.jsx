import { useLocation, useNavigate } from "react-router-dom";
import {
  BedDoubleIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  ChartColumnIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleUserIcon,
  ClipboardListIcon,
  CreditCardIcon,
  HotelIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { hasPermission, removeStoredToken } from "../lib/auth.js";

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    permission: "dashboard",
  },
  { path: "/rooms", label: "Rooms", icon: BedDoubleIcon, permission: "rooms" },
  {
    path: "/bookings",
    label: "Bookings",
    icon: CalendarCheckIcon,
    permission: "bookings",
  },
  {
    path: "/reception",
    label: "Reception",
    icon: HotelIcon,
    permission: "checkin",
  },
  { path: "/guests", label: "Guests", icon: UsersIcon, permission: "guests" },
  {
    path: "/payments",
    label: "Payments",
    icon: CreditCardIcon,
    permission: "finance",
  },
  {
    path: "/invoices",
    label: "Invoices",
    icon: ClipboardListIcon,
    permission: "invoices",
  },
  {
    path: "/ledger",
    label: "Ledger",
    icon: BookOpenIcon,
    permission: "ledger",
  },
  {
    path: "/housekeeping",
    label: "Housekeeping",
    icon: SparklesIcon,
    permission: "housekeeping",
  },
  {
    path: "/maintenance",
    label: "Maintenance",
    icon: WrenchIcon,
    permission: "maintenance",
  },
  {
    path: "/automation",
    label: "Automation",
    icon: ZapIcon,
    permission: "automation",
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: ChartColumnIcon,
    permission: "reports",
  },
  { path: "/staff", label: "Staff", icon: ShieldIcon, permission: "staff" },
  {
    path: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    permission: "settings",
  },
];

export function Sidebar() {
  const e = useNavigate(),
    t = useLocation(),
    { auth: r, ui: n, setSidebarOpen: l, clearAuth: o } = useStore(),
    { sidebarOpen: u, darkMode: d } = n,
    m = () => {
      (removeStoredToken(), o(), e("/"));
    },
    h = navItems.filter((g) =>
      r.role
        ? r.role === "SUPER_ADMIN" || r.role === "HOTEL_ADMIN"
          ? true
          : hasPermission(r.role, g.permission)
        : false,
    );
  return (
    <aside
      className={`
      ${u ? "w-64" : "w-16"} 
      ${d ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      flex flex-col border-r transition-all duration-300 ease-in-out fixed h-full z-30
    `}
    >
      <div
        className={`flex items-center h-16 px-4 border-b ${d ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <HotelIcon className="w-5 h-5 text-white" />
          </div>
          {u && (
            <div>
              <h1
                className={`text-lg font-bold ${d ? "text-white" : "text-gray-900"}`}
              >
                Auralis
              </h1>
              <p className={`text-xs ${d ? "text-gray-400" : "text-gray-500"}`}>
                Hotel ERP
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => l(!u)}
          className={`ml-auto p-1 rounded-lg ${d ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
        >
          {u ? (
            <ChevronLeftIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {h.map((g) => {
          const p = t.pathname === g.path,
            NavIcon = g.icon;
          return (
            <button
              onClick={() => e(g.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${p ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200" : d ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"}`}
              title={u ? undefined : g.label}
              key={g.path}
            >
              <NavIcon className="w-5 h-5 flex-shrink-0" />
              {u && (
                <span className="text-sm font-medium truncate">{g.label}</span>
              )}
              {p && u && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              )}
            </button>
          );
        })}
      </nav>
      <div
        className={`p-3 border-t ${d ? "border-gray-700" : "border-gray-200"}`}
      >
        <div
          onClick={() => e("/profile")}
          className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer ${d ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CircleUserIcon className="w-5 h-5 text-white" />
          </div>
          {u && (
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${d ? "text-white" : "text-gray-900"}`}
              >
                {r.name}
              </p>
              <p
                className={`text-xs truncate ${d ? "text-gray-400" : "text-gray-500"}`}
              >
                {r.role?.replace("_", " ")}
              </p>
            </div>
          )}
          {u && (
            <button
              onClick={(g) => {
                (g.stopPropagation(), m());
              }}
              className={`p-1.5 rounded-lg ${d ? "hover:bg-gray-700 text-gray-400" : "hover:bg-red-50 text-red-500"}`}
              title="Logout"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
