import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRightIcon,
  CalendarIcon,
  CircleCheckBigIcon,
  CircleXIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { bookingsAPI } from "../lib/api.js";

const BOOKING_STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "text-gray-700", bg: "bg-gray-100" },
  CONFIRMED: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-100" },
  CHECKED_IN: {
    label: "Checked In",
    color: "text-green-700",
    bg: "bg-green-100",
  },
  CHECKED_OUT: {
    label: "Checked Out",
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  CANCELLED: { label: "Cancelled", color: "text-red-700", bg: "bg-red-100" },
  NO_SHOW: { label: "No Show", color: "text-orange-700", bg: "bg-orange-100" },
};

export function BookingsPage() {
  const e = useNavigate(),
    { ui: t, auth: r } = useStore(),
    { darkMode: n } = t,
    [l, o] = useState([]),
    [u, d] = useState([]),
    [m, h] = useState(true),
    [g, p] = useState(""),
    [b, S] = useState("ALL"),
    [w, N] = useState(null),
    [j, A] = useState(false),
    [C, E] = useState(""),
    [D, P] = useState(false);
  (useEffect(() => {
    k();
  }, []),
    useEffect(() => {
      _();
    }, [l, g, b]));
  const k = async () => {
      h(true);
      const $ = await bookingsAPI.getAll(
        r.role === "GUEST" ? { guestId: r.userId || undefined } : undefined,
      );
      (o($.filter((J) => J !== null)), h(false));
    },
    _ = () => {
      let $ = [...l];
      (g &&
        ($ = $.filter(
          (J) =>
            J.bookingNumber?.toLowerCase().includes(g.toLowerCase()) ||
            J.guest?.name?.toLowerCase().includes(g.toLowerCase()) ||
            J.room?.number?.includes(g),
        )),
        b !== "ALL" && ($ = $.filter((J) => J.status === b)),
        d($));
    },
    L = async ($) => {
      A(true);
      try {
        (await bookingsAPI.checkIn($, r.userId || "system"),
          await k(),
          N(null),
          toast.success("Guest checked in successfully! 🏨"));
      } catch (J) {
        toast.error(J.message);
      } finally {
        A(false);
      }
    },
    M = async ($) => {
      A(true);
      try {
        (await bookingsAPI.checkOut($, r.userId || "system"),
          await k(),
          N(null),
          toast.success(
            "Guest checked out successfully! Room queued for cleaning.",
          ));
      } catch (J) {
        toast.error(J.message);
      } finally {
        A(false);
      }
    },
    H = async () => {
      if (!w || !C) {
        toast.error("Please provide a cancellation reason");
        return;
      }
      A(true);
      try {
        (await bookingsAPI.cancel(w.id, C, r.userId || "system"),
          await k(),
          N(null),
          P(false),
          E(""),
          toast.success("Booking cancelled. Refund will be processed."));
      } catch ($) {
        toast.error($.message);
      } finally {
        A(false);
      }
    },
    X = `rounded-2xl border ${n ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`,
    R = u.reduce(($, J) => $ + (J.netAmount || 0), 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${n ? "text-white" : "text-gray-900"}`}
        >
          Bookings
        </h1>
        {r.role !== "GUEST" && (
          <button
            onClick={() => e("/book")}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
          >
            <PlusIcon className="w-4 h-4" />
            {" New Booking"}
          </button>
        )}
      </div>
      {r.role !== "GUEST" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(BOOKING_STATUS_CONFIG).map(([$, J]) => {
            const ie = l.filter((G) => G.status === $).length;
            return (
              <div
                className={`${X} p-4 cursor-pointer hover:opacity-80`}
                onClick={() => S($)}
                key={$}
              >
                <p className="text-2xl font-bold">{ie}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${J.bg} ${J.color}`}
                >
                  {J.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div className={`${X} p-4 flex flex-wrap gap-3`}>
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-48 ${n ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
        >
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            value={g}
            onChange={($) => p($.target.value)}
            placeholder="Search booking number, guest..."
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
        <select
          value={b}
          onChange={($) => S($.target.value)}
          className={`border rounded-xl px-3 py-2 text-sm ${n ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white text-gray-700"}`}
        >
          <option value="ALL">All Status</option>
          {Object.entries(BOOKING_STATUS_CONFIG).map(([$, J]) => (
            <option value={$} key={$}>
              {J.label}
            </option>
          ))}
        </select>
        {r.role !== "GUEST" && (
          <div
            className={`px-3 py-2 rounded-xl border text-sm font-medium ${n ? "border-gray-600 text-gray-300 bg-gray-700" : "border-gray-200 text-gray-600 bg-gray-50"}`}
          >
            Total: ₹{R.toLocaleString()}
          </div>
        )}
      </div>
      <div className={X}>
        {m ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : u.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p
              className={`font-medium ${n ? "text-gray-400" : "text-gray-500"}`}
            >
              No bookings found
            </p>
            <button
              onClick={() => e("/book")}
              className="mt-4 text-amber-500 hover:text-amber-600 text-sm font-medium"
            >
              Create new booking →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${n ? "border-gray-700" : "border-gray-100"}`}
                >
                  {[
                    "Booking #",
                    "Guest",
                    "Room",
                    "Dates",
                    "Amount",
                    "Status",
                    "Actions",
                  ].map(($) => (
                    <th
                      className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide ${n ? "text-gray-400" : "text-gray-500"}`}
                      key={$}
                    >
                      {$}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {u.map(($) => {
                  const J = BOOKING_STATUS_CONFIG[$.status];
                  return (
                    <tr
                      className={`border-b hover:opacity-80 transition-opacity ${n ? "border-gray-700 hover:bg-gray-750" : "border-gray-50 hover:bg-gray-50"}`}
                      key={$.id}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-semibold text-amber-600">
                          {$.bookingNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p
                          className={`font-medium text-sm ${n ? "text-white" : "text-gray-900"}`}
                        >
                          {$.guest?.name || "Guest"}
                        </p>
                        <p
                          className={`text-xs ${n ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {$.guest?.email}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p
                          className={`font-medium text-sm ${n ? "text-white" : "text-gray-900"}`}
                        >
                          {"Room "}
                          {$.room?.number}
                        </p>
                        <p
                          className={`text-xs ${n ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {$.room?.type}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p
                          className={`text-xs ${n ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {new Date($.checkIn + "T00:00").toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                          {" → "}
                          {new Date($.checkOut + "T00:00").toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </p>
                        <p
                          className={`text-xs ${n ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {$.adults + ($.children || 0)}
                          {" guests"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p
                          className={`font-bold text-sm ${n ? "text-white" : "text-gray-900"}`}
                        >
                          ₹{$.netAmount?.toLocaleString()}
                        </p>
                        <p
                          className={`text-xs ${n ? "text-gray-400" : "text-gray-500"}`}
                        >
                          incl. GST
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${J.bg} ${J.color}`}
                        >
                          {J.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => N($)}
                            className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {$.status === "CONFIRMED" && r.role !== "GUEST" && (
                            <button
                              onClick={() => L($.id)}
                              className="p-1.5 rounded-lg hover:bg-green-100 text-green-600"
                              title="Check In"
                            >
                              <CircleCheckBigIcon className="w-4 h-4" />
                            </button>
                          )}
                          {$.status === "CHECKED_IN" && r.role !== "GUEST" && (
                            <button
                              onClick={() => M($.id)}
                              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"
                              title="Check Out"
                            >
                              <ArrowRightIcon className="w-4 h-4" />
                            </button>
                          )}
                          {!["CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(
                            $.status,
                          ) && (
                            <button
                              onClick={() => {
                                (N($), P(true));
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"
                              title="Cancel"
                            >
                              <CircleXIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {w && !D && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => N(null)}
        >
          <div
            className={`max-w-2xl w-full rounded-2xl p-6 shadow-2xl ${n ? "bg-gray-800" : "bg-white"} max-h-[90vh] overflow-y-auto`}
            onClick={($) => $.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2
                  className={`text-xl font-bold ${n ? "text-white" : "text-gray-900"}`}
                >
                  {w.bookingNumber}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${BOOKING_STATUS_CONFIG[w.status]?.bg} ${BOOKING_STATUS_CONFIG[w.status]?.color}`}
                >
                  {BOOKING_STATUS_CONFIG[w.status]?.label}
                </span>
              </div>
              <button
                onClick={() => N(null)}
                className={`p-1.5 rounded-lg ${n ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div
                className={`p-4 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-2 ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  GUEST
                </p>
                <p
                  className={`font-bold ${n ? "text-white" : "text-gray-900"}`}
                >
                  {w.guest?.name}
                </p>
                <p
                  className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  {w.guest?.email}
                </p>
                <p
                  className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  {w.guest?.phone}
                </p>
              </div>
              <div
                className={`p-4 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-2 ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  ROOM
                </p>
                <p
                  className={`font-bold ${n ? "text-white" : "text-gray-900"}`}
                >
                  {"Room "}
                  {w.room?.number}
                  {" - "}
                  {w.room?.type}
                </p>
                <p
                  className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  {"Floor "}
                  {w.room?.floor}
                  {" • "}
                  {w.room?.bedType}
                </p>
                <p
                  className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  ₹{w.room?.pricePerNight?.toLocaleString()}/night
                </p>
              </div>
              <div
                className={`p-4 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-2 ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  DATES
                </p>
                <p
                  className={`font-bold ${n ? "text-white" : "text-gray-900"}`}
                >
                  {new Date(w.checkIn + "T00:00").toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                  })}
                  {" → "}
                  {new Date(w.checkOut + "T00:00").toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p
                  className={`text-sm ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  {w.adults}
                  {" adults, "}
                  {w.children}
                  {" children"}
                </p>
              </div>
              <div
                className={`p-4 rounded-xl ${n ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <p
                  className={`text-xs font-medium mb-2 ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  PAYMENT
                </p>
                <p
                  className={`font-bold text-lg ${n ? "text-white" : "text-gray-900"}`}
                >
                  ₹{w.netAmount?.toLocaleString()}
                </p>
                <p
                  className={`text-xs ${n ? "text-gray-400" : "text-gray-500"}`}
                >
                  GST: ₹{w.taxAmount?.toLocaleString()}
                </p>
                {w.discountAmount > 0 && (
                  <p className="text-xs text-green-600">
                    Discount: -₹{w.discountAmount?.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            {w.specialRequests && (
              <div
                className={`p-3 rounded-xl mb-4 ${n ? "bg-amber-900/20 border border-amber-800" : "bg-amber-50 border border-amber-200"}`}
              >
                <p className="text-xs text-amber-700 font-medium">
                  Special Requests:
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  {w.specialRequests}
                </p>
              </div>
            )}
            {r.role !== "GUEST" && (
              <div className="flex gap-3">
                {w.status === "CONFIRMED" && (
                  <button
                    onClick={() => L(w.id)}
                    disabled={j}
                    className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-70"
                  >
                    ✓ Check In Guest
                  </button>
                )}
                {w.status === "CHECKED_IN" && (
                  <button
                    onClick={() => M(w.id)}
                    disabled={j}
                    className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-70"
                  >
                    → Check Out Guest
                  </button>
                )}
                {!["CHECKED_IN", "CHECKED_OUT", "CANCELLED"].includes(
                  w.status,
                ) && (
                  <button
                    onClick={() => P(true)}
                    className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-100 border border-red-200"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {D && w && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${n ? "bg-gray-800" : "bg-white"}`}
          >
            <h3
              className={`text-lg font-bold mb-3 ${n ? "text-white" : "text-gray-900"}`}
            >
              Cancel Booking
            </h3>
            <p
              className={`text-sm mb-4 ${n ? "text-gray-400" : "text-gray-500"}`}
            >
              {"This will cancel booking "}
              {w.bookingNumber}. An 80% refund will be processed.
            </p>
            <textarea
              value={C}
              onChange={($) => E($.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 ${n ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => P(false)}
                className={`flex-1 border py-2.5 rounded-xl font-medium ${n ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}
              >
                Back
              </button>
              <button
                onClick={H}
                disabled={j}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 disabled:opacity-70"
              >
                {j ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
