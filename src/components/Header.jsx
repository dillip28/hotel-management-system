import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BellIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { notificationsAPI } from "../lib/api.js";

export function Header({ title: e }) {
  const t = useNavigate(),
    {
      ui: r,
      toggleDarkMode: n,
      setSidebarOpen: l,
      setNotificationCount: o,
    } = useStore(),
    { darkMode: u, notifications: d, sidebarOpen: m } = r,
    [h, g] = useState(false),
    [p, b] = useState([]);
  useEffect(() => {
    S();
    const A = setInterval(S, 3e4);
    return () => clearInterval(A);
  }, []);
  const S = async () => {
      const A = await notificationsAPI.getAll();
      b(A.slice(0, 10));
      const C = notificationsAPI.getUnreadCount();
      o(C);
    },
    w = async (A) => {
      (await notificationsAPI.markRead(A), S());
    },
    N = async () => {
      (await notificationsAPI.markAllRead(),
        S(),
        toast.success("All notifications marked as read"));
    },
    j = {
      BOOKING: "bg-blue-100 text-blue-700",
      PAYMENT: "bg-green-100 text-green-700",
      MAINTENANCE: "bg-red-100 text-red-700",
      WARNING: "bg-yellow-100 text-yellow-700",
      INFO: "bg-gray-100 text-gray-700",
      SUCCESS: "bg-emerald-100 text-emerald-700",
      ERROR: "bg-red-100 text-red-700",
    };
  return (
    <header
      className={`h-16 px-4 flex items-center justify-between border-b z-20 ${u ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => l(!m)}
          className={`p-2 rounded-lg md:hidden ${u ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        {e && (
          <h2
            className={`text-lg font-semibold ${u ? "text-white" : "text-gray-900"}`}
          >
            {e}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${u ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"}`}
        >
          <SearchIcon className="w-4 h-4" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none w-40"
          />
        </div>
        <button
          onClick={n}
          className={`p-2 rounded-xl transition-colors ${u ? "bg-gray-800 text-amber-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {u ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
        <div className="relative">
          <button
            onClick={() => g(!h)}
            className={`p-2 rounded-xl relative transition-colors ${u ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <BellIcon className="w-5 h-5" />
            {d > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {d > 9 ? "9+" : d}
              </span>
            )}
          </button>
          {h && (
            <div
              className={`absolute right-0 top-12 w-96 rounded-2xl shadow-2xl border z-50 ${u ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div
                className={`flex items-center justify-between p-4 border-b ${u ? "border-gray-700" : "border-gray-100"}`}
              >
                <h3
                  className={`font-semibold ${u ? "text-white" : "text-gray-900"}`}
                >
                  {"Notifications "}
                  {d > 0 && <span className="text-red-500">({d})</span>}
                </h3>
                <button
                  onClick={N}
                  className="text-xs text-amber-500 hover:text-amber-600 font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {p.length === 0 ? (
                  <div
                    className={`p-8 text-center ${u ? "text-gray-500" : "text-gray-400"}`}
                  >
                    No notifications
                  </div>
                ) : (
                  p.map((A) => (
                    <div
                      onClick={() => w(A.id)}
                      className={`p-4 border-b cursor-pointer transition-colors ${u ? "border-gray-700 hover:bg-gray-750" : "border-gray-50 hover:bg-gray-50"} ${A.isRead ? "" : u ? "bg-gray-750" : "bg-amber-50/50"}`}
                      key={A.id}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${j[A.type] || "bg-gray-100 text-gray-600"}`}
                        >
                          {A.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${u ? "text-white" : "text-gray-900"}`}
                          >
                            {A.title}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${u ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {A.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${u ? "text-gray-600" : "text-gray-400"}`}
                          >
                            {new Date(A.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!A.isRead && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                className={`p-3 border-t ${u ? "border-gray-700" : "border-gray-100"}`}
              >
                <button
                  onClick={() => {
                    (g(false), t("/notifications"));
                  }}
                  className="w-full text-center text-sm text-amber-500 hover:text-amber-600 font-medium"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
