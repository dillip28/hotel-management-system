import { create } from "zustand";

export const useStore = create((e) => ({
  auth: {
    userId: null,
    email: null,
    name: null,
    role: null,
    isAuthenticated: false,
  },
  ui: {
    sidebarOpen: true,
    darkMode: localStorage.getItem("auralis_darkmode") === "true",
    activeModule: "dashboard",
    loading: false,
    notifications: 0,
  },
  setAuth: (t) =>
    e((r) => ({ auth: { ...r.auth, ...t, isAuthenticated: true } })),
  clearAuth: () =>
    e({
      auth: {
        userId: null,
        email: null,
        name: null,
        role: null,
        isAuthenticated: false,
      },
    }),
  setSidebarOpen: (t) => e((r) => ({ ui: { ...r.ui, sidebarOpen: t } })),
  toggleDarkMode: () =>
    e((t) => {
      const r = !t.ui.darkMode;
      return (
        localStorage.setItem("auralis_darkmode", String(r)),
        { ui: { ...t.ui, darkMode: r } }
      );
    }),
  setActiveModule: (t) => e((r) => ({ ui: { ...r.ui, activeModule: t } })),
  setLoading: (t) => e((r) => ({ ui: { ...r.ui, loading: t } })),
  setNotificationCount: (t) =>
    e((r) => ({ ui: { ...r.ui, notifications: t } })),
}));
