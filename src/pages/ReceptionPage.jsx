import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowRightIcon,
  ClockIcon,
  HotelIcon,
  UserCheckIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { bookingsAPI } from "../lib/api.js";

export function ReceptionPage() {
  const { ui: e, auth: t } = useStore(),
    { darkMode: r } = e,
    [n, l] = useState([]),
    [o, u] = useState([]),
    [d, m] = useState([]),
    [h, g] = useState(true),
    [p, b] = useState(false),
    [S, w] = useState(false),
    N = new Date().toISOString().split("T")[0];
  useEffect(() => {
    j();
  }, []);
  const j = async () => {
      g(true);
      const D = await bookingsAPI.getAll(),
        P = D.filter((L) => L && L.checkIn === N && L.status === "CONFIRMED"),
        k = D.filter((L) => L && L.checkOut === N && L.status === "CHECKED_IN"),
        _ = D.filter((L) => L && L.status === "CHECKED_IN");
      (l(P), u(k), m(_), g(false));
    },
    A = async (D) => {
      b(true);
      try {
        (await bookingsAPI.checkIn(D, t.userId || "system"),
          await j(),
          toast.success("✅ Guest checked in successfully!"));
      } catch (P) {
        toast.error(P.message);
      } finally {
        b(false);
      }
    },
    C = async (D) => {
      b(true);
      try {
        (await bookingsAPI.checkOut(D, t.userId || "system"),
          await j(),
          toast.success("✅ Guest checked out. Room queued for cleaning."));
      } catch (P) {
        toast.error(P.message);
      } finally {
        b(false);
      }
    },
    E = `rounded-2xl border p-5 ${r ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${r ? "text-white" : "text-gray-900"}`}
          >
            Reception Desk
          </h1>
          <p className={`text-sm ${r ? "text-gray-400" : "text-gray-500"}`}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => w(true)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <HotelIcon className="w-4 h-4" />
          {" Walk-in Booking"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className={`${E} text-center`}>
          <div className="text-3xl font-bold text-blue-600">{n.length}</div>
          <p
            className={`text-sm mt-1 font-medium ${r ? "text-gray-400" : "text-gray-500"}`}
          >
            Check-ins Today
          </p>
        </div>
        <div className={`${E} text-center`}>
          <div className="text-3xl font-bold text-orange-600">{o.length}</div>
          <p
            className={`text-sm mt-1 font-medium ${r ? "text-gray-400" : "text-gray-500"}`}
          >
            Check-outs Today
          </p>
        </div>
        <div className={`${E} text-center`}>
          <div className="text-3xl font-bold text-green-600">{d.length}</div>
          <p
            className={`text-sm mt-1 font-medium ${r ? "text-gray-400" : "text-gray-500"}`}
          >
            Guests In-House
          </p>
        </div>
      </div>
      {h ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={E}>
            <div className="flex items-center gap-2 mb-4">
              <UserCheckIcon className="w-5 h-5 text-green-500" />
              <h2 className={`font-bold ${r ? "text-white" : "text-gray-900"}`}>
                Expected Check-ins
              </h2>
              <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                {n.length}
              </span>
            </div>
            {n.length === 0 ? (
              <div
                className={`text-center py-8 ${r ? "text-gray-500" : "text-gray-400"}`}
              >
                <ClockIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No check-ins expected today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {n.map((D) => (
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl border ${r ? "border-gray-700 bg-gray-700/50" : "border-gray-100 bg-gray-50"}`}
                    key={D.id}
                  >
                    <div>
                      <p
                        className={`font-semibold text-sm ${r ? "text-white" : "text-gray-900"}`}
                      >
                        {D.guest?.name}
                      </p>
                      <p
                        className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {"Room "}
                        {D.room?.number}
                        {" • "}
                        {D.bookingNumber}
                      </p>
                      <p
                        className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {D.adults}
                        {" adult"}
                        {D.adults !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => A(D.id)}
                      disabled={p}
                      className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 disabled:opacity-70"
                    >
                      Check In ✓
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={E}>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightIcon className="w-5 h-5 text-orange-500" />
              <h2 className={`font-bold ${r ? "text-white" : "text-gray-900"}`}>
                Expected Check-outs
              </h2>
              <span className="ml-auto bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                {o.length}
              </span>
            </div>
            {o.length === 0 ? (
              <div
                className={`text-center py-8 ${r ? "text-gray-500" : "text-gray-400"}`}
              >
                <ClockIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No check-outs due today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {o.map((D) => (
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl border ${r ? "border-gray-700 bg-gray-700/50" : "border-gray-100 bg-gray-50"}`}
                    key={D.id}
                  >
                    <div>
                      <p
                        className={`font-semibold text-sm ${r ? "text-white" : "text-gray-900"}`}
                      >
                        {D.guest?.name}
                      </p>
                      <p
                        className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {"Room "}
                        {D.room?.number}
                        {" • "}
                        {D.bookingNumber}
                      </p>
                      <p className="text-xs text-amber-600">
                        {"Checked in "}
                        {new Date(D.checkedInAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => C(D.id)}
                      disabled={p}
                      className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-600 disabled:opacity-70"
                    >
                      Check Out →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={`${E} xl:col-span-2`}>
            <div className="flex items-center gap-2 mb-4">
              <HotelIcon className="w-5 h-5 text-blue-500" />
              <h2 className={`font-bold ${r ? "text-white" : "text-gray-900"}`}>
                Currently In-House
              </h2>
              <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                {d.length}
                {" guests"}
              </span>
            </div>
            {d.length === 0 ? (
              <p
                className={`text-center py-8 text-sm ${r ? "text-gray-500" : "text-gray-400"}`}
              >
                No guests currently checked in
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className={`border-b ${r ? "border-gray-700" : "border-gray-100"}`}
                    >
                      {[
                        "Guest",
                        "Room",
                        "Check-In",
                        "Check-Out",
                        "Amount",
                        "Action",
                      ].map((D) => (
                        <th
                          className={`text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide ${r ? "text-gray-400" : "text-gray-500"}`}
                          key={D}
                        >
                          {D}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.map((D) => (
                      <tr
                        className={`border-b ${r ? "border-gray-700" : "border-gray-50"}`}
                        key={D.id}
                      >
                        <td className="py-3 px-3">
                          <p
                            className={`font-medium ${r ? "text-white" : "text-gray-900"}`}
                          >
                            {D.guest?.name}
                          </p>
                          <p
                            className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {D.guest?.phone}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <p
                            className={`font-medium ${r ? "text-white" : "text-gray-900"}`}
                          >
                            {"Room "}
                            {D.room?.number}
                          </p>
                          <p
                            className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {D.room?.type}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-xs">
                          {new Date(D.checkIn + "T00:00").toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs">
                          {new Date(D.checkOut + "T00:00").toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p
                            className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                          >
                            ₹{D.netAmount?.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => C(D.id)}
                            disabled={p}
                            className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-medium hover:bg-orange-200 disabled:opacity-70"
                          >
                            Check Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
