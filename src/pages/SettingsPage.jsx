import { useState } from "react";
import toast from "react-hot-toast";
import { MoonIcon, RefreshCwIcon, SunIcon, Trash2Icon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { db } from "../lib/db.js";
import { seedDatabase } from "../lib/seed.js";

export function SettingsPage() {
  const { ui: e, toggleDarkMode: t, auth: r } = useStore(),
    { darkMode: n } = e,
    [l, o] = useState(false),
    u = async () => {
      confirm("Reset all data to default? This cannot be undone!") &&
        (o(true),
        db.clearAll(),
        await seedDatabase(),
        toast.success("Database reset to default data!"),
        setTimeout(() => window.location.reload(), 1e3),
        o(false));
    },
    d = `rounded-2xl border p-5 ${n ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6 max-w-2xl">
      <h1
        className={`text-2xl font-bold ${n ? "text-white" : "text-gray-900"}`}
      >
        Settings
      </h1>
      <div className={d}>
        <h3 className={`font-bold mb-4 ${n ? "text-white" : "text-gray-900"}`}>
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {n ? (
              <MoonIcon className="w-5 h-5 text-indigo-400" />
            ) : (
              <SunIcon className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <p
                className={`font-medium ${n ? "text-white" : "text-gray-900"}`}
              >
                Dark Mode
              </p>
              <p className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}>
                Toggle between light and dark theme
              </p>
            </div>
          </div>
          <button
            onClick={t}
            className={`relative w-14 h-7 rounded-full transition-colors ${n ? "bg-indigo-600" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${n ? "translate-x-7" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      </div>
      <div className={d}>
        <h3 className={`font-bold mb-4 ${n ? "text-white" : "text-gray-900"}`}>
          Account Information
        </h3>
        <div className="space-y-3 text-sm">
          <div
            className={`flex justify-between p-3 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <span className="text-gray-500">Name</span>
            <span
              className={`font-medium ${n ? "text-white" : "text-gray-900"}`}
            >
              {r.name}
            </span>
          </div>
          <div
            className={`flex justify-between p-3 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <span className="text-gray-500">Email</span>
            <span
              className={`font-medium ${n ? "text-white" : "text-gray-900"}`}
            >
              {r.email}
            </span>
          </div>
          <div
            className={`flex justify-between p-3 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <span className="text-gray-500">Role</span>
            <span
              className={`font-medium ${n ? "text-white" : "text-gray-900"}`}
            >
              {r.role?.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
      <div className={d}>
        <h3 className={`font-bold mb-4 ${n ? "text-white" : "text-gray-900"}`}>
          System Information
        </h3>
        <div className="space-y-2 text-sm">
          {[
            { label: "Platform", value: "Auralis Hotel ERP v1.0" },
            {
              label: "Database",
              value: "PostgreSQL (LocalStorage Simulation)",
            },
            { label: "Authentication", value: "JWT + bcrypt" },
            { label: "Real-time", value: "Event-driven Updates" },
            {
              label: "Framework",
              value: "React + Vite + TypeScript + Tailwind",
            },
          ].map((m) => (
            <div
              className={`flex justify-between p-3 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
              key={m.label}
            >
              <span className="text-gray-500">{m.label}</span>
              <span
                className={`font-medium text-right ${n ? "text-gray-300" : "text-gray-700"}`}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {(r.role === "SUPER_ADMIN" || r.role === "HOTEL_ADMIN") && (
        <div className={`${d} border-red-200 ${n ? "border-red-800" : ""}`}>
          <h3 className="font-bold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`font-medium ${n ? "text-white" : "text-gray-900"}`}
                >
                  Reset Database
                </p>
                <p
                  className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  Reset all data to default seed data
                </p>
              </div>
              <button
                onClick={u}
                disabled={l}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-70"
              >
                {l ? (
                  <RefreshCwIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2Icon className="w-4 h-4" />
                )}
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
