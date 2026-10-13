import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon, SearchIcon, StarIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { guestsAPI } from "../lib/api.js";

export function GuestsPage() {
  const { ui: e } = useStore(),
    { darkMode: t } = e,
    [r, n] = useState([]),
    [l, o] = useState(true),
    [u, d] = useState(""),
    [m, h] = useState(null),
    [g, p] = useState(false),
    [b, S] = useState({
      name: "",
      email: "",
      phone: "",
      country: "India",
      idType: "Aadhaar",
      idNumber: "",
      nationality: "Indian",
    });
  useEffect(() => {
    w();
  }, []);
  const w = async () => {
      o(true);
      const E = await guestsAPI.getAll();
      (n(E), o(false));
    },
    N = r.filter(
      (E) =>
        E.name.toLowerCase().includes(u.toLowerCase()) ||
        E.email.toLowerCase().includes(u.toLowerCase()) ||
        E.phone.includes(u),
    ),
    j = async (E) => {
      const D = await guestsAPI.getById(E);
      h(D);
    },
    A = async () => {
      if (!b.name || !b.email || !b.phone) {
        toast.error("Fill in required fields");
        return;
      }
      (await guestsAPI.create(b),
        toast.success("Guest profile created!"),
        p(false),
        S({
          name: "",
          email: "",
          phone: "",
          country: "India",
          idType: "Aadhaar",
          idNumber: "",
          nationality: "Indian",
        }),
        w());
    },
    C = `rounded-2xl border p-5 ${t ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${t ? "text-white" : "text-gray-900"}`}
        >
          Guest Management
        </h1>
        <button
          onClick={() => p(true)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <PlusIcon className="w-4 h-4" />
          {" Add Guest"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className={`${C} text-center`}>
          <p className="text-2xl font-bold text-amber-500">{r.length}</p>
          <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
            Total Guests
          </p>
        </div>
        <div className={`${C} text-center`}>
          <p className="text-2xl font-bold text-green-500">
            ₹{r.reduce((E, D) => E + (D.totalSpent || 0), 0).toLocaleString()}
          </p>
          <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
            Total Revenue
          </p>
        </div>
        <div className={`${C} text-center`}>
          <p className="text-2xl font-bold text-blue-500">
            {r.reduce((E, D) => E + (D.loyaltyPoints || 0), 0).toLocaleString()}
          </p>
          <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
            Loyalty Points
          </p>
        </div>
      </div>
      <div className={`${C} flex gap-3`}>
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 ${t ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
        >
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            value={u}
            onChange={(E) => d(E.target.value)}
            placeholder="Search guests..."
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
      </div>
      <div className={C}>
        {l ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${t ? "border-gray-700" : "border-gray-100"}`}
                >
                  {[
                    "Guest",
                    "Contact",
                    "Country",
                    "Stays",
                    "Total Spent",
                    "Loyalty Points",
                    "",
                  ].map((E) => (
                    <th
                      className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide ${t ? "text-gray-400" : "text-gray-500"}`}
                      key={E}
                    >
                      {E}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {N.map((E) => (
                  <tr
                    className={`border-b ${t ? "border-gray-700" : "border-gray-50"}`}
                    key={E.id}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {E.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${t ? "text-white" : "text-gray-900"}`}
                          >
                            {E.name}
                          </p>
                          <p
                            className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {E.idType}
                            {": "}
                            {E.idNumber || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p
                        className={`text-sm ${t ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {E.email}
                      </p>
                      <p
                        className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {E.phone}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-sm">{E.country}</td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600">
                      {E.totalStays}
                    </td>
                    <td className="py-3 px-3">
                      <p
                        className={`font-bold ${t ? "text-white" : "text-gray-900"}`}
                      >
                        ₹{(E.totalSpent || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 text-sm text-amber-600">
                        <StarIcon className="w-3.5 h-3.5 fill-current" />
                        {E.loyaltyPoints || 0}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => j(E.id)}
                        className="text-amber-500 hover:text-amber-600 text-sm font-medium"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {m && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => h(null)}
        >
          <div
            className={`max-w-lg w-full rounded-2xl p-6 shadow-2xl ${t ? "bg-gray-800" : "bg-white"} max-h-[85vh] overflow-y-auto`}
            onClick={(E) => E.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold ${t ? "text-white" : "text-gray-900"}`}
                  >
                    {m.name}
                  </h3>
                  <p
                    className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {m.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => h(null)}
                className={`p-1.5 rounded-lg ${t ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div
                className={`p-3 rounded-xl text-center ${t ? "bg-gray-700" : "bg-amber-50"}`}
              >
                <p className="text-xl font-bold text-amber-600">
                  {m.totalStays}
                </p>
                <p
                  className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                >
                  Stays
                </p>
              </div>
              <div
                className={`p-3 rounded-xl text-center ${t ? "bg-gray-700" : "bg-green-50"}`}
              >
                <p className="text-lg font-bold text-green-600">
                  ₹{(m.totalSpent || 0).toLocaleString()}
                </p>
                <p
                  className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                >
                  Total Spent
                </p>
              </div>
              <div
                className={`p-3 rounded-xl text-center ${t ? "bg-gray-700" : "bg-blue-50"}`}
              >
                <p className="text-xl font-bold text-blue-600">
                  {m.loyaltyPoints || 0}
                </p>
                <p
                  className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                >
                  Points
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className={t ? "text-gray-300" : "text-gray-700"}>
                  {m.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Country</span>
                <span className={t ? "text-gray-300" : "text-gray-700"}>
                  {m.country}
                </span>
              </div>
              {m.idType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{m.idType}</span>
                  <span className={t ? "text-gray-300" : "text-gray-700"}>
                    {m.idNumber || "Not provided"}
                  </span>
                </div>
              )}
            </div>
            {m.bookings && m.bookings.length > 0 && (
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wide mb-2 ${t ? "text-gray-400" : "text-gray-500"}`}
                >
                  Booking History
                </p>
                <div className="space-y-2">
                  {m.bookings.slice(0, 5).map((E) => (
                    <div
                      className={`flex justify-between items-center p-2.5 rounded-xl text-xs ${t ? "bg-gray-700" : "bg-gray-50"}`}
                      key={E?.id}
                    >
                      <div>
                        <p
                          className={`font-medium ${t ? "text-white" : "text-gray-900"}`}
                        >
                          {E?.bookingNumber}
                        </p>
                        <p
                          className={`${t ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {"Room "}
                          {E?.room?.number}
                          {" • "}
                          {E?.status}
                        </p>
                      </div>
                      <span
                        className={`font-bold ${t ? "text-white" : "text-gray-900"}`}
                      >
                        ₹{E?.netAmount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {g && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => p(false)}
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${t ? "bg-gray-800" : "bg-white"}`}
            onClick={(E) => E.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
            >
              Add Guest Profile
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Full Name *",
                  field: "name",
                  placeholder: "John Doe",
                },
                {
                  label: "Email *",
                  field: "email",
                  placeholder: "john@example.com",
                },
                {
                  label: "Phone *",
                  field: "phone",
                  placeholder: "+91 XXXXX XXXXX",
                },
                {
                  label: "ID Number",
                  field: "idNumber",
                  placeholder: "Enter ID number",
                },
              ].map((E) => (
                <div key={E.field}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    {E.label}
                  </label>
                  <input
                    value={b[E.field]}
                    onChange={(D) => S({ ...b, [E.field]: D.target.value })}
                    placeholder={E.placeholder}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Country
                  </label>
                  <select
                    value={b.country}
                    onChange={(E) => S({ ...b, country: E.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {[
                      "India",
                      "USA",
                      "UK",
                      "UAE",
                      "Singapore",
                      "Australia",
                      "Other",
                    ].map((E) => (
                      <option value={E} key={E}>
                        {E}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    ID Type
                  </label>
                  <select
                    value={b.idType}
                    onChange={(E) => S({ ...b, idType: E.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {["Aadhaar", "PAN Card", "Passport", "Driving License"].map(
                      (E) => (
                        <option value={E} key={E}>
                          {E}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => p(false)}
                className={`flex-1 border py-2.5 rounded-xl text-sm ${t ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}
              >
                Cancel
              </button>
              <button
                onClick={A}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600"
              >
                Add Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
