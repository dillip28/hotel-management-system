import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useStore } from "../store/useStore.js";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";
import { getCurrentUser } from "../lib/auth.js";

export function DashboardLayout() {
  const e = useNavigate(),
    { auth: t, setAuth: r, ui: n } = useStore(),
    { darkMode: l, sidebarOpen: o } = n;
  return (
    useEffect(() => {
      if (!t.isAuthenticated) {
        const u = getCurrentUser();
        u
          ? r({ userId: u.userId, email: u.email, name: u.name, role: u.role })
          : e("/login");
      }
    }, [t.isAuthenticated]),
    useEffect(() => {
      l
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    }, [l]),
    t.isAuthenticated ? (
      <div
        className={`flex h-screen overflow-hidden ${l ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      >
        <Sidebar />
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${o ? "ml-64" : "ml-16"}`}
        >
          <Header />
          <main
            className={`flex-1 overflow-y-auto p-6 ${l ? "bg-gray-950" : "bg-gray-50"}`}
          >
            <Outlet />
          </main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: l ? "#1f2937" : "#fff",
              color: l ? "#f9fafb" : "#111827",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            },
          }}
        />
      </div>
    ) : null
  );
}
