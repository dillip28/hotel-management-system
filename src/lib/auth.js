import { db } from "./db.js";

export function hashPassword(e) {
  let t = 0;
  const n = e + "auralis_salt_2024_secure";
  for (let l = 0; l < n.length; l++) {
    const o = n.charCodeAt(l);
    ((t = (t << 5) - t + o), (t = t & t));
  }
  return `$auralis$${Math.abs(t).toString(36)}$${btoa(n).slice(0, 20)}`;
}

function verifyPassword(e, t) {
  return hashPassword(e) === t;
}

function generateToken(e) {
  const t = {
    userId: e.id,
    email: e.email,
    role: e.role,
    name: e.name,
    iat: Date.now(),
    exp: Date.now() + 864e5,
  };
  return btoa(JSON.stringify(t));
}

function verifyToken(e) {
  try {
    const t = JSON.parse(atob(e));
    return t.exp < Date.now() ? null : t;
  } catch {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem("auralis_token");
}

function setStoredToken(e) {
  localStorage.setItem("auralis_token", e);
}

export function removeStoredToken() {
  localStorage.removeItem("auralis_token");
}

export function getCurrentUser() {
  const e = getStoredToken();
  return e ? verifyToken(e) : null;
}

const RolePermissions = {
  SUPER_ADMIN: ["*"],
  HOTEL_ADMIN: [
    "dashboard",
    "rooms",
    "bookings",
    "guests",
    "staff",
    "finance",
    "reports",
    "housekeeping",
    "maintenance",
    "automation",
    "settings",
  ],
  RECEPTIONIST: [
    "dashboard",
    "rooms",
    "bookings",
    "guests",
    "checkin",
    "checkout",
  ],
  ACCOUNTANT: [
    "dashboard",
    "finance",
    "invoices",
    "ledger",
    "reports",
    "payments",
  ],
  HOUSEKEEPING: ["dashboard", "housekeeping", "rooms.status"],
  MAINTENANCE: ["dashboard", "maintenance", "devices"],
  GUEST: ["booking", "profile", "invoices.own"],
};

export function hasPermission(e, t) {
  const r = RolePermissions[e];
  return r
    ? r.includes("*")
      ? true
      : r.some((n) => n === t || t.startsWith(n + "."))
    : false;
}

export const authAPI = {
  login: async (e) => {
    await simulateDelay(300);
    const t = db.findFirst("users", { email: e.email });
    if (!t) return { success: false, error: "Invalid email or password" };
    if (!t.isActive)
      return {
        success: false,
        error: "Account is deactivated. Contact administrator.",
      };
    if (!verifyPassword(e.password, t.passwordHash))
      return { success: false, error: "Invalid email or password" };
    db.update("users", t.id, { lastLogin: new Date().toISOString() });
    const r = generateToken(t);
    (setStoredToken(r),
      db.create("auditlogs", {
        id: undefined,
        userId: t.id,
        action: "LOGIN",
        entity: "User",
        entityId: t.id,
        createdAt: new Date().toISOString(),
      }));
    const { passwordHash: n, ...l } = t;
    return { success: true, token: r, user: l };
  },
  register: async (e) => {
    if ((await simulateDelay(400), db.findFirst("users", { email: e.email })))
      return { success: false, error: "Email already registered" };
    if (e.password.length < 6)
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    const r = db.create("users", {
      email: e.email,
      name: e.name,
      passwordHash: hashPassword(e.password),
      role: "GUEST",
      phone: e.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    db.create("guests", {
      userId: r.id,
      name: e.name,
      email: e.email,
      phone: e.phone || "",
      country: "India",
      totalStays: 0,
      totalSpent: 0,
      loyaltyPoints: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const n = generateToken(r);
    setStoredToken(n);
    const { passwordHash: l, ...o } = r;
    return { success: true, token: n, user: o };
  },
  logout: () => {
    removeStoredToken();
  },
  me: () => getCurrentUser(),
};

export function simulateDelay(e) {
  return new Promise((t) => setTimeout(t, e));
}
