import { hashPassword, simulateDelay } from "./auth.js";
import { db } from "./db.js";

export const housekeepingAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db
      .findMany("housekeeping")
      .map((t) => {
        const r = db.findById("rooms", t.roomId),
          n = t.assignedTo ? db.findById("users", t.assignedTo) : null;
        return { ...t, room: r, assignee: n };
      })
      .sort(
        (t, r) =>
          new Date(r.createdAt).getTime() - new Date(t.createdAt).getTime(),
      )
  ),
  create: async (e) => (
    await simulateDelay(300),
    db.create("housekeeping", {
      ...e,
      status: "PENDING",
      checklist: e.checklist || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  ),
  updateStatus: async (e, t, r) => {
    await simulateDelay(200);
    const n = { status: t, updatedAt: new Date().toISOString() };
    if (
      (t === "IN_PROGRESS" && (n.startedAt = new Date().toISOString()),
      t === "COMPLETED")
    ) {
      n.completedAt = new Date().toISOString();
      const l = db.findById("housekeeping", e);
      l &&
        db.update("rooms", l.roomId, {
          status: "VACANT",
          isAvailable: true,
          lastCleaned: new Date().toISOString(),
        });
    }
    return (r && Object.assign(n, r), db.update("housekeeping", e, n));
  },
  updateChecklist: async (e, t) => (
    await simulateDelay(150),
    db.update("housekeeping", e, { checklist: t })
  ),
  getStats: async () => {
    await simulateDelay(150);
    const e = db.findMany("housekeeping");
    return {
      total: e.length,
      pending: e.filter((t) => t.status === "PENDING").length,
      inProgress: e.filter((t) => t.status === "IN_PROGRESS").length,
      completed: e.filter((t) => t.status === "COMPLETED").length,
      urgent: e.filter((t) => t.priority === "URGENT" || t.priority === "HIGH")
        .length,
    };
  },
};

export const maintenanceAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db
      .findMany("maintenance")
      .map((t) => {
        const r = t.roomId ? db.findById("rooms", t.roomId) : null,
          n = t.assignedTo ? db.findById("users", t.assignedTo) : null;
        return { ...t, room: r, assignee: n };
      })
      .sort(
        (t, r) =>
          new Date(r.createdAt).getTime() - new Date(t.createdAt).getTime(),
      )
  ),
  create: async (e) => {
    await simulateDelay(400);
    const t = db.findMany("maintenance"),
      r = `MNT-${new Date().getFullYear()}-${String(t.length + 1).padStart(4, "0")}`,
      n = db.create("maintenance", {
        ...e,
        ticketNumber: r,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    return (
      e.roomId &&
        (e.priority === "HIGH" || e.priority === "URGENT") &&
        db.update("rooms", e.roomId, {
          status: "MAINTENANCE",
          isAvailable: false,
        }),
      db.create("notifications", {
        title: "New Maintenance Ticket",
        message: `${r}: ${e.title}`,
        type: "MAINTENANCE",
        isRead: false,
        referenceId: n.id,
        createdAt: new Date().toISOString(),
      }),
      n
    );
  },
  updateStatus: async (e, t, r) => {
    await simulateDelay(200);
    const n = { status: t, updatedAt: new Date().toISOString() };
    if (
      (t === "IN_PROGRESS" && (n.startedAt = new Date().toISOString()),
      t === "COMPLETED")
    ) {
      n.completedAt = new Date().toISOString();
      const l = db.findById("maintenance", e);
      l?.roomId &&
        db.update("rooms", l.roomId, {
          status: "DIRTY",
          lastMaintenance: new Date().toISOString(),
        });
    }
    return (r && Object.assign(n, r), db.update("maintenance", e, n));
  },
  getStats: async () => {
    await simulateDelay(150);
    const e = db.findMany("maintenance");
    return {
      total: e.length,
      pending: e.filter((t) => t.status === "PENDING").length,
      inProgress: e.filter((t) => t.status === "IN_PROGRESS").length,
      completed: e.filter((t) => t.status === "COMPLETED").length,
      urgent: e.filter((t) => t.priority === "URGENT").length,
      estimatedCost: e.reduce((t, r) => t + (r.estimatedCost || 0), 0),
      actualCost: e.reduce((t, r) => t + (r.actualCost || 0), 0),
    };
  },
};

export const ledgerAPI = {
  getAll: async (e) => {
    await simulateDelay(200);
    let t = db.findMany("ledger");
    return (
      e && (t = t.filter((r) => r.type === e)),
      t.sort((r, n) => new Date(n.date).getTime() - new Date(r.date).getTime())
    );
  },
  create: async (e) => (
    await simulateDelay(300),
    db.create("ledger", { ...e, createdAt: new Date().toISOString() })
  ),
  getStats: async () => {
    await simulateDelay(200);
    const e = db.findMany("ledger"),
      t = e.filter((u) => u.type === "INCOME"),
      r = e.filter(
        (u) =>
          u.type === "EXPENSE" || u.type === "UTILITY" || u.type === "SALARY",
      ),
      n = t.reduce((u, d) => u + d.credit, 0),
      l = r.reduce((u, d) => u + d.debit, 0),
      o = {};
    return (
      e.forEach((u) => {
        const d = u.date.substring(0, 7);
        (o[d] || (o[d] = { income: 0, expenses: 0, profit: 0 }),
          (o[d].income += u.credit),
          (o[d].expenses += u.debit),
          (o[d].profit = o[d].income - o[d].expenses));
      }),
      {
        totalIncome: n,
        totalExpenses: l,
        netProfit: n - l,
        profitMargin: n > 0 ? Math.round(((n - l) / n) * 100) : 0,
        monthlyData: Object.entries(o)
          .sort(([u], [d]) => u.localeCompare(d))
          .map(([u, d]) => ({ month: u, ...d })),
        byCategory: sumByCategory(e),
      }
    );
  },
  getMonthlyStatement: async (e, t) => {
    await simulateDelay(200);
    const r = `${e}-${String(t).padStart(2, "0")}`;
    return db
      .query("ledger", (l) => l.date.startsWith(r))
      .sort((l, o) => new Date(l.date).getTime() - new Date(o.date).getTime());
  },
};

function sumByCategory(e) {
  const t = {};
  return (
    e.forEach((r) => {
      (t[r.category] || (t[r.category] = 0), (t[r.category] += r.amount));
    }),
    Object.entries(t).map(([r, n]) => ({ category: r, amount: n }))
  );
}

export const energyAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db
      .findMany("energy")
      .sort((e, t) => new Date(t.date).getTime() - new Date(e.date).getTime())
  ),
  getStats: async () => {
    await simulateDelay(200);
    const e = db.findMany("energy"),
      t = e.slice(-30),
      r = e.slice(-7),
      n = t.reduce((g, p) => g + p.electricityKwh, 0),
      l = t.reduce((g, p) => g + p.totalCost, 0),
      o = n / 30,
      u = l / 30,
      d = r.reduce((g, p) => g + p.electricityKwh, 0),
      m = e.slice(-14, -7).reduce((g, p) => g + p.electricityKwh, 0),
      h = m > 0 ? Math.round(((d - m) / m) * 100) : 0;
    return {
      totalKwh: n,
      totalCost: l,
      avgDailyKwh: Math.round(o),
      avgDailyCost: Math.round(u),
      weeklyKwh: d,
      weeklyChange: h,
      co2Saved: Math.round(n * 0.05),
      chartData: t.map((g) => ({
        date: g.date,
        electricity: g.electricityKwh,
        water: g.waterLiters / 100,
        cost: g.totalCost,
      })),
    };
  },
};

export const devicesAPI = {
  getByRoom: async (e) => (
    await simulateDelay(150),
    db.findMany("devices", { roomId: e })
  ),
  getAll: async () => (await simulateDelay(200), db.findMany("devices")),
  toggle: async (e, t) => (
    await simulateDelay(200),
    db.update("devices", e, { isOn: t, lastUpdated: new Date().toISOString() })
  ),
  setValue: async (e, t) => (
    await simulateDelay(150),
    db.update("devices", e, {
      value: t,
      lastUpdated: new Date().toISOString(),
    })
  ),
  setAutomation: async (e, t) => (
    await simulateDelay(150),
    db.update("devices", e, { automationEnabled: t })
  ),
  simulateSensorData: (e) => {
    const t =
      db.query("bookings", (r) => r.roomId === e && r.status === "CHECKED_IN")
        .length > 0;
    return {
      roomId: e,
      temperature: t ? 20 + Math.random() * 4 : 24 + Math.random() * 4,
      humidity: 40 + Math.random() * 30,
      occupancy: t,
      co2Level: t ? 600 + Math.random() * 400 : 400 + Math.random() * 100,
      lightLevel: t ? 200 + Math.random() * 600 : Math.random() * 100,
      timestamp: new Date().toISOString(),
    };
  },
};

export const notificationsAPI = {
  getAll: async () => (
    await simulateDelay(100),
    db
      .findMany("notifications")
      .sort(
        (e, t) =>
          new Date(t.createdAt).getTime() - new Date(e.createdAt).getTime(),
      )
  ),
  markRead: async (e) => (
    await simulateDelay(100),
    db.update("notifications", e, { isRead: true })
  ),
  markAllRead: async () => {
    (await simulateDelay(200),
      db
        .findMany("notifications")
        .forEach((t) => db.update("notifications", t.id, { isRead: true })));
  },
  getUnreadCount: () => db.query("notifications", (e) => !e.isRead).length,
};

export const reportsAPI = {
  getDashboard: async () => {
    await simulateDelay(400);
    const e = db.findMany("rooms"),
      t = db.findMany("bookings"),
      r = db.query("payments", (k) => k.status === "COMPLETED"),
      n = new Date().toISOString().split("T")[0],
      l = n.substring(0, 7),
      o = r.reduce((k, _) => k + _.amount, 0),
      u = r
        .filter((k) => k.paidAt?.startsWith(l))
        .reduce((k, _) => k + _.amount, 0),
      d = r
        .filter((k) => k.paidAt?.startsWith(n))
        .reduce((k, _) => k + _.amount, 0),
      m = e.filter((k) => k.status === "OCCUPIED").length,
      h = Math.round((m / e.length) * 100),
      g = t.filter((k) => k.status === "CHECKED_IN").length,
      p = t.filter((k) => k.status === "CONFIRMED" && k.checkIn === n).length,
      b = t.filter((k) => k.status === "CHECKED_IN" && k.checkOut === n).length,
      S =
        m > 0
          ? e
              .filter((k) => k.status === "OCCUPIED")
              .reduce((k, _) => k + _.pricePerNight, 0) / m
          : 0,
      w = Math.round((S * h) / 100),
      N = [];
    for (let k = 13; k >= 0; k--) {
      const _ = new Date(Date.now() - k * 864e5).toISOString().split("T")[0],
        M = r
          .filter((H) => H.paidAt?.startsWith(_))
          .reduce((H, X) => H + X.amount, 0);
      N.push({ date: _.slice(5), revenue: M });
    }
    const j = {};
    t.forEach((k) => {
      j[k.source] = (j[k.source] || 0) + 1;
    });
    const A = Object.entries(j).map(([k, _]) => ({ name: k, value: _ })),
      C = {};
    e.forEach((k) => {
      (C[k.type] || (C[k.type] = { total: 0, occupied: 0 }),
        C[k.type].total++,
        k.status === "OCCUPIED" && C[k.type].occupied++);
    });
    const E = Object.entries(C).map(([k, _]) => ({
        type: k,
        total: _.total,
        occupied: _.occupied,
        rate: Math.round((_.occupied / _.total) * 100),
      })),
      D = db.query(
        "maintenance",
        (k) =>
          k.status !== "COMPLETED" &&
          (k.priority === "URGENT" || k.priority === "HIGH"),
      ).length,
      P = db.query("housekeeping", (k) => k.status === "PENDING").length;
    return {
      summary: {
        totalRevenue: o,
        monthlyRevenue: u,
        todayRevenue: d,
        occupancyRate: h,
        activeBookings: g,
        pendingCheckIns: p,
        pendingCheckOuts: b,
        totalRooms: e.length,
        occupiedRooms: m,
        vacantRooms: e.filter((k) => k.status === "VACANT").length,
        adr: Math.round(S),
        revpar: w,
        maintenanceAlerts: D,
        housekeepingPending: P,
      },
      charts: { revenueChart: N, bookingSources: A, roomTypeData: E },
    };
  },
  getRevenueReport: async (e) => {
    await simulateDelay(300);
    const t = db.query("payments", (n) => n.status === "COMPLETED"),
      r = {};
    return (
      t.forEach((n) => {
        let l;
        const o = new Date(n.paidAt || n.createdAt);
        if (e === "daily") l = o.toISOString().split("T")[0];
        else if (e === "weekly") {
          const u = Math.floor(o.getDate() / 7);
          l = `${o.getFullYear()}-W${u}`;
        } else
          l = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`;
        r[l] = (r[l] || 0) + n.amount;
      }),
      Object.entries(r)
        .sort(([n], [l]) => n.localeCompare(l))
        .map(([n, l]) => ({ period: n, revenue: l }))
    );
  },
};

export const staffAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db.findMany("staff").map((t) => {
      const r = db.findById("users", t.userId);
      return { ...t, user: r };
    })
  ),
  create: async (e, t) => {
    await simulateDelay(400);
    const r = hashPassword,
      n = db.create("users", {
        ...e,
        passwordHash: r(e.password || "Welcome@123"),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      l = db.create("staff", {
        ...t,
        userId: n.id,
        isActive: true,
        joinedAt: new Date().toISOString(),
      });
    return { user: n, staff: l };
  },
};

function findConflictingBookings(e, t, r, n) {
  const l = new Date(t),
    o = new Date(r);
  return (
    db.query("bookings", (d) => {
      if (
        d.roomId !== e ||
        (n && d.id === n) ||
        ["CANCELLED", "NO_SHOW", "CHECKED_OUT"].includes(d.status)
      )
        return false;
      const m = new Date(d.checkIn),
        h = new Date(d.checkOut);
      return l < h && o > m;
    }).length === 0
  );
}

function getAvailableRooms(e, t, r) {
  return db
    .findMany("rooms")
    .filter((l) =>
      l.status === "MAINTENANCE" || (r && l.type !== r)
        ? false
        : findConflictingBookings(l.id, e, t),
    );
}

export function calculateNights(e, t) {
  const n = new Date(e),
    l = new Date(t);
  return Math.max(1, Math.round((l.getTime() - n.getTime()) / 864e5));
}

export function calculatePricing(e, t, r, n = 0) {
  const l = calculateNights(t, r),
    o = e.pricePerNight * l,
    u = Math.round((o * n) / 100),
    d = o - u,
    m = 18,
    h = Math.round((d * m) / 100),
    g = d + h;
  return {
    nights: l,
    pricePerNight: e.pricePerNight,
    subtotal: o,
    discountAmount: u,
    discountPercent: n,
    taxRate: m,
    taxAmount: h,
    netAmount: g,
  };
}

function generateBookingNumber() {
  const e = new Date().getFullYear(),
    r = db.findMany("bookings").length + 1;
  return `AUR-${e}-${String(r).padStart(4, "0")}`;
}

function generateInvoiceNumber() {
  const e = new Date().getFullYear(),
    r = db.findMany("invoices").length + 1;
  return `INV-${e}-${String(r).padStart(4, "0")}`;
}

export const bookingsAPI = {
  getAll: async (e) => {
    await simulateDelay(200);
    let t = db.findMany("bookings");
    return (
      e?.status && (t = t.filter((r) => r.status === e.status)),
      e?.guestId && (t = t.filter((r) => r.guestId === e.guestId)),
      t
        .map((r) => enrichBooking(r))
        .filter((r) => r !== null)
        .sort(
          (r, n) =>
            new Date(n.createdAt).getTime() - new Date(r.createdAt).getTime(),
        )
    );
  },
  getById: async (e) => {
    await simulateDelay(150);
    const t = db.findById("bookings", e);
    return t ? enrichBooking(t) : null;
  },
  create: async (e) => {
    await simulateDelay(500);
    const t = new Date(e.checkIn);
    if (new Date(e.checkOut) <= t)
      throw new Error("Check-out date must be after check-in date");
    if (!findConflictingBookings(e.roomId, e.checkIn, e.checkOut))
      throw new Error(
        "Room is not available for the selected dates. Please choose different dates.",
      );
    let l = e.guestId;
    if (!l && e.guestData) {
      let p = db.findFirst("guests", { email: e.guestData.email });
      (!p &&
        e.guestData.email &&
        (p = db.create("guests", {
          name: e.guestData.name || "Guest",
          email: e.guestData.email,
          phone: e.guestData.phone || "",
          country: e.guestData.country || "India",
          idType: e.guestData.idType,
          idNumber: e.guestData.idNumber,
          totalStays: 0,
          totalSpent: 0,
          loyaltyPoints: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        (l = p?.id));
    }
    if (!l) throw new Error("Guest information required");
    const o = db.findById("rooms", e.roomId);
    if (!o) throw new Error("Room not found");
    const u = calculatePricing(
        o,
        e.checkIn,
        e.checkOut,
        e.discountPercent || 0,
      ),
      d = db.create("bookings", {
        bookingNumber: generateBookingNumber(),
        guestId: l,
        roomId: e.roomId,
        checkIn: e.checkIn,
        checkOut: e.checkOut,
        adults: e.adults,
        children: e.children || 0,
        status: "CONFIRMED",
        totalAmount: u.subtotal,
        taxAmount: u.taxAmount,
        discountAmount: u.discountAmount,
        netAmount: u.netAmount,
        specialRequests: e.specialRequests,
        source: e.source || "Online",
        confirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    db.update("rooms", e.roomId, { status: "RESERVED", isAvailable: false });
    const m = db.create("payments", {
        bookingId: d.id,
        amount: u.netAmount,
        method: e.paymentMethod,
        status: "COMPLETED",
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      h = db.create("invoices", {
        invoiceNumber: generateInvoiceNumber(),
        bookingId: d.id,
        guestId: l,
        items: [
          {
            description: `Room ${o.number} - ${o.type} (${u.nights} nights @ ₹${o.pricePerNight}/night)`,
            quantity: u.nights,
            rate: o.pricePerNight,
            amount: u.subtotal,
          },
          ...(u.discountAmount > 0
            ? [
                {
                  description: `Discount (${u.discountPercent}%)`,
                  quantity: 1,
                  rate: -u.discountAmount,
                  amount: -u.discountAmount,
                },
              ]
            : []),
          {
            description: `GST @ ${u.taxRate}%`,
            quantity: 1,
            rate: u.taxAmount,
            amount: u.taxAmount,
          },
        ],
        subtotal: u.subtotal,
        taxRate: u.taxRate,
        taxAmount: u.taxAmount,
        discountAmount: u.discountAmount,
        totalAmount: u.netAmount,
        status: "PAID",
        issuedAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }),
      g = db.findById("guests", l);
    return (
      g &&
        db.update("guests", l, {
          totalStays: (g.totalStays || 0) + 1,
          totalSpent: (g.totalSpent || 0) + u.netAmount,
          loyaltyPoints: (g.loyaltyPoints || 0) + Math.floor(u.netAmount / 100),
        }),
      db.create("ledger", {
        type: "INCOME",
        category: "Room Revenue",
        description: `Booking ${d.bookingNumber} - Room ${o.number}`,
        amount: u.netAmount,
        debit: 0,
        credit: u.netAmount,
        referenceId: d.id,
        referenceType: "Booking",
        date: new Date().toISOString().split("T")[0],
        enteredBy: "system",
        createdAt: new Date().toISOString(),
      }),
      db.create("notifications", {
        title: "New Booking Confirmed",
        message: `Booking ${d.bookingNumber} confirmed for Room ${o.number}`,
        type: "BOOKING",
        isRead: false,
        referenceId: d.id,
        createdAt: new Date().toISOString(),
      }),
      { booking: enrichBooking(d), payment: m, invoice: h }
    );
  },
  checkIn: async (e, t) => {
    await simulateDelay(300);
    const r = db.findById("bookings", e);
    if (!r) throw new Error("Booking not found");
    if (!["CONFIRMED", "PENDING"].includes(r.status))
      throw new Error("Booking cannot be checked in");
    const n = db.update("bookings", e, {
      status: "CHECKED_IN",
      checkedInAt: new Date().toISOString(),
    });
    return (
      db.update("rooms", r.roomId, { status: "OCCUPIED", isAvailable: false }),
      db.create("notifications", {
        title: "Guest Checked In",
        message: `Booking ${r.bookingNumber} - Guest checked in successfully`,
        type: "BOOKING",
        isRead: false,
        createdAt: new Date().toISOString(),
      }),
      enrichBooking(n)
    );
  },
  checkOut: async (e, t) => {
    await simulateDelay(300);
    const r = db.findById("bookings", e);
    if (!r) throw new Error("Booking not found");
    if (r.status !== "CHECKED_IN") throw new Error("Guest is not checked in");
    const n = db.update("bookings", e, {
      status: "CHECKED_OUT",
      checkedOutAt: new Date().toISOString(),
    });
    return (
      db.update("rooms", r.roomId, { status: "DIRTY", isAvailable: false }),
      db.create("housekeeping", {
        roomId: r.roomId,
        assignedTo: "u-housekeeping",
        type: "CLEANING",
        status: "PENDING",
        priority: "HIGH",
        scheduledAt: new Date().toISOString(),
        notes: `Guest checked out from booking ${r.bookingNumber}`,
        checklist: [
          { item: "Change bed linens", completed: false },
          { item: "Clean bathroom", completed: false },
          { item: "Vacuum/mop floor", completed: false },
          { item: "Restock amenities", completed: false },
          { item: "Check minibar", completed: false },
          { item: "Inspect room for damages", completed: false },
          { item: "Reset room temperature", completed: false },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      enrichBooking(n)
    );
  },
  cancel: async (e, t, r) => {
    await simulateDelay(300);
    const n = db.findById("bookings", e);
    if (!n) throw new Error("Booking not found");
    if (["CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(n.status))
      throw new Error("Booking cannot be cancelled");
    const l = db.update("bookings", e, {
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      cancellationReason: t,
    });
    db.update("rooms", n.roomId, { status: "VACANT", isAvailable: true });
    const o = db.query(
      "payments",
      (u) => u.bookingId === e && u.status === "COMPLETED",
    );
    if (o.length > 0) {
      const u = Math.round(n.netAmount * 0.8);
      db.update("payments", o[0].id, {
        status: "REFUNDED",
        refundedAt: new Date().toISOString(),
        refundAmount: u,
        refundReason: t,
      });
    }
    return enrichBooking(l);
  },
  extend: async (e, t, r) => {
    await simulateDelay(300);
    const n = db.findById("bookings", e);
    if (!n) throw new Error("Booking not found");
    if (!findConflictingBookings(n.roomId, n.checkOut, t, e))
      throw new Error("Room not available for extension period");
    const o = db.findById("rooms", n.roomId);
    if (!o) throw new Error("Room not found");
    const u = calculateNights(n.checkOut, t),
      d = o.pricePerNight * u,
      m = Math.round(d * 0.18),
      h = db.update("bookings", e, {
        checkOut: t,
        totalAmount: n.totalAmount + d,
        taxAmount: n.taxAmount + m,
        netAmount: n.netAmount + d + m,
      });
    return (
      db.create("payments", {
        bookingId: e,
        amount: d + m,
        method: "CARD",
        status: "COMPLETED",
        transactionId: `TXN-EXT-${Date.now()}`,
        paidAt: new Date().toISOString(),
        notes: `Extension: ${u} additional nights`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      enrichBooking(h)
    );
  },
  transferRoom: async (e, t, r) => {
    await simulateDelay(400);
    const n = db.findById("bookings", e);
    if (!n) throw new Error("Booking not found");
    if (!findConflictingBookings(t, n.checkIn, n.checkOut))
      throw new Error("New room not available");
    const o = n.roomId,
      u = db.update("bookings", e, { roomId: t });
    return (
      db.update("rooms", o, { status: "DIRTY", isAvailable: false }),
      db.update("rooms", t, { status: "OCCUPIED", isAvailable: false }),
      enrichBooking(u)
    );
  },
};

function enrichBooking(e) {
  if (!e) return null;
  const t = db.findById("rooms", e.roomId),
    r = db.findById("guests", e.guestId),
    n = db.query("payments", (o) => o.bookingId === e.id),
    l = db.findFirst("invoices", { bookingId: e.id });
  return { ...e, room: t, guest: r, payments: n, invoice: l };
}

export const roomsAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db.findMany("rooms").sort((e, t) => e.number.localeCompare(t.number))
  ),
  getById: async (e) => {
    await simulateDelay(100);
    const t = db.findById("rooms", e);
    if (!t) return null;
    const r = db.query(
        "bookings",
        (l) =>
          l.roomId === e &&
          ["CHECKED_IN", "RESERVED", "CONFIRMED"].includes(l.status),
      )[0],
      n = r ? db.findById("guests", r.guestId) : null;
    return { ...t, currentBooking: r, currentGuest: n };
  },
  updateStatus: async (e, t, r) => (
    await simulateDelay(200),
    db.update("rooms", e, {
      status: t,
      isAvailable: t === "VACANT",
      updatedAt: new Date().toISOString(),
    })
  ),
  getAvailability: async (e, t, r) => (
    await simulateDelay(300),
    getAvailableRooms(e, t, r)
  ),
  getStats: async () => {
    await simulateDelay(150);
    const e = db.findMany("rooms");
    return {
      total: e.length,
      vacant: e.filter((t) => t.status === "VACANT").length,
      occupied: e.filter((t) => t.status === "OCCUPIED").length,
      dirty: e.filter((t) => t.status === "DIRTY").length,
      maintenance: e.filter((t) => t.status === "MAINTENANCE").length,
      reserved: e.filter((t) => t.status === "RESERVED").length,
      occupancyRate: Math.round(
        (e.filter((t) => t.status === "OCCUPIED").length / e.length) * 100,
      ),
    };
  },
};

export const guestsAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db.findMany("guests").map((t) => {
      const r = db.query("bookings", (n) => n.guestId === t.id);
      return { ...t, bookingCount: r.length };
    })
  ),
  getById: async (e) => {
    await simulateDelay(150);
    const t = db.findById("guests", e);
    if (!t) return null;
    const r = db.query("bookings", (n) => n.guestId === e);
    return { ...t, bookings: r.map((n) => enrichBooking(n)) };
  },
  create: async (e) => (
    await simulateDelay(300),
    db.create("guests", {
      name: e.name || "",
      email: e.email || "",
      phone: e.phone || "",
      country: e.country || "India",
      city: e.city,
      nationality: e.nationality,
      idType: e.idType,
      idNumber: e.idNumber,
      dateOfBirth: e.dateOfBirth,
      preferences: e.preferences,
      totalStays: 0,
      totalSpent: 0,
      loyaltyPoints: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  ),
  update: async (e, t) => (await simulateDelay(200), db.update("guests", e, t)),
};

export const paymentsAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db
      .findMany("payments")
      .map((t) => {
        const r = db.findById("bookings", t.bookingId),
          n = r ? db.findById("guests", r.guestId) : null;
        return { ...t, booking: r, guest: n };
      })
      .sort(
        (t, r) =>
          new Date(r.createdAt).getTime() - new Date(t.createdAt).getTime(),
      )
  ),
  processPayment: async (e, t, r) => {
    await simulateDelay(800);
    const n = db.create("payments", {
        bookingId: e,
        amount: t,
        method: r,
        status: "COMPLETED",
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      l = db.findById("bookings", e);
    return (
      db.create("ledger", {
        type: "INCOME",
        category: "Room Revenue",
        description: `Payment for ${l?.bookingNumber || e}`,
        amount: t,
        debit: 0,
        credit: t,
        referenceId: e,
        referenceType: "Payment",
        date: new Date().toISOString().split("T")[0],
        enteredBy: "system",
        createdAt: new Date().toISOString(),
      }),
      n
    );
  },
  getStats: async () => {
    await simulateDelay(200);
    const e = db.query("payments", (l) => l.status === "COMPLETED"),
      t = new Date().toISOString().split("T")[0],
      r = e.filter((l) => l.paidAt?.startsWith(t)),
      n = {};
    return (
      e.forEach((l) => {
        n[l.method] = (n[l.method] || 0) + l.amount;
      }),
      {
        totalRevenue: e.reduce((l, o) => l + o.amount, 0),
        todayRevenue: r.reduce((l, o) => l + o.amount, 0),
        totalTransactions: e.length,
        todayTransactions: r.length,
        byMethod: n,
      }
    );
  },
};

export const invoicesAPI = {
  getAll: async () => (
    await simulateDelay(200),
    db
      .findMany("invoices")
      .map((e) => {
        const t = db.findById("guests", e.guestId),
          r = db.findById("bookings", e.bookingId);
        return { ...e, guest: t, booking: r };
      })
      .sort(
        (e, t) =>
          new Date(t.createdAt).getTime() - new Date(e.createdAt).getTime(),
      )
  ),
  getById: async (e) => {
    await simulateDelay(150);
    const t = db.findById("invoices", e);
    if (!t) return null;
    const r = db.findById("guests", t.guestId),
      n = db.findById("bookings", t.bookingId),
      l = n ? db.findById("rooms", n.roomId) : null;
    return { ...t, guest: r, booking: n, room: l };
  },
};
