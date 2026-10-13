import { useEffect, useState } from "react";
import { DownloadIcon, EyeIcon, SearchIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { invoicesAPI } from "../lib/api.js";

export function InvoicesPage() {
  const { ui: e } = useStore(),
    { darkMode: t } = e,
    [r, n] = useState([]),
    [l, o] = useState(true),
    [u, d] = useState(""),
    [m, h] = useState(null);
  useEffect(() => {
    g();
  }, []);
  const g = async () => {
      o(true);
      const j = await invoicesAPI.getAll();
      (n(j), o(false));
    },
    p = async (j) => {
      const A = await invoicesAPI.getById(j);
      h(A);
    },
    b = r.filter(
      (j) =>
        j.invoiceNumber?.toLowerCase().includes(u.toLowerCase()) ||
        j.guest?.name?.toLowerCase().includes(u.toLowerCase()) ||
        j.booking?.bookingNumber?.toLowerCase().includes(u.toLowerCase()),
    ),
    S = {
      PAID: "bg-green-100 text-green-700",
      ISSUED: "bg-blue-100 text-blue-700",
      DRAFT: "bg-gray-100 text-gray-600",
      CANCELLED: "bg-red-100 text-red-700",
    },
    w = `rounded-2xl border p-5 ${t ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`,
    N = (j) => {
      const A = `
      AURALIS HOTEL - TAX INVOICE
      ===========================
      Invoice: ${j.invoiceNumber}
      Date: ${new Date(j.createdAt).toLocaleDateString("en-IN")}
      
      BILL TO:
      ${j.guest?.name}
      ${j.guest?.email}
      ${j.guest?.phone}
      
      BOOKING DETAILS:
      Booking: ${j.booking?.bookingNumber}
      Room: ${j.room?.number} - ${j.room?.type}
      Check-in: ${j.booking?.checkIn}
      Check-out: ${j.booking?.checkOut}
      
      ITEMS:
      ${(j.items || []).map(
        (C) => `${C.description}: ₹${C.amount.toLocaleString()}`,
      ).join(`
`)}
      
      Subtotal: ₹${j.subtotal?.toLocaleString()}
      GST (${j.taxRate}%): ₹${j.taxAmount?.toLocaleString()}
      ${j.discountAmount > 0 ? `Discount: -₹${j.discountAmount?.toLocaleString()}` : ""}
      TOTAL: ₹${j.totalAmount?.toLocaleString()}
      
      Status: ${j.status}
      
      Thank you for choosing Auralis!
    `;
      alert(A);
    };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${t ? "text-white" : "text-gray-900"}`}
        >
          Invoices
        </h1>
        <div className="flex gap-3">
          <div
            className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${t ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
          >
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <input
              value={u}
              onChange={(j) => d(j.target.value)}
              placeholder="Search invoices..."
              className="bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["PAID", "ISSUED", "DRAFT", "CANCELLED"].map((j) => {
          const A = r.filter((E) => E.status === j).length,
            C = r
              .filter((E) => E.status === j)
              .reduce((E, D) => E + (D.totalAmount || 0), 0);
          return (
            <div className={w} key={j}>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${S[j]}`}
              >
                {j}
              </span>
              <p
                className={`text-2xl font-bold mt-2 ${t ? "text-white" : "text-gray-900"}`}
              >
                {A}
              </p>
              <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
                ₹{C.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
      <div className={w}>
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
                    "Invoice #",
                    "Booking",
                    "Guest",
                    "Amount",
                    "GST",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((j) => (
                    <th
                      className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide ${t ? "text-gray-400" : "text-gray-500"}`}
                      key={j}
                    >
                      {j}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.map((j) => (
                  <tr
                    className={`border-b ${t ? "border-gray-700" : "border-gray-50"}`}
                    key={j.id}
                  >
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs font-semibold text-amber-600">
                        {j.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">
                      {j.booking?.bookingNumber || "-"}
                    </td>
                    <td className="py-3 px-3">
                      <p
                        className={`font-medium ${t ? "text-white" : "text-gray-900"}`}
                      >
                        {j.guest?.name || "-"}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <p
                        className={`font-bold ${t ? "text-white" : "text-gray-900"}`}
                      >
                        ₹{j.totalAmount?.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-sm">
                      ₹{j.taxAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${S[j.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {new Date(j.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => p(j.id)}
                          className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600"
                          title="View"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => N(j)}
                          className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"
                          title="Print"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>
                      </div>
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
            className={`max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden ${t ? "bg-gray-800" : "bg-white"}`}
            onClick={(j) => j.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">AURALIS HOTEL</h2>
                  <p className="text-amber-100 text-sm">
                    123 Luxury Avenue, Mumbai 400001
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-amber-100 text-sm">TAX INVOICE</p>
                  <p className="text-xl font-bold">{m.invoiceNumber}</p>
                  <p className="text-amber-100 text-sm">
                    {new Date(m.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Bill To
                  </p>
                  <p
                    className={`font-bold ${t ? "text-white" : "text-gray-900"}`}
                  >
                    {m.guest?.name}
                  </p>
                  <p
                    className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {m.guest?.email}
                  </p>
                  <p
                    className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {m.guest?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                    Booking Details
                  </p>
                  <p className="font-bold text-amber-600">
                    {m.booking?.bookingNumber}
                  </p>
                  <p
                    className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {m.booking?.checkIn}
                    {" → "}
                    {m.booking?.checkOut}
                  </p>
                  {m.room && (
                    <p
                      className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {"Room "}
                      {m.room.number}
                      {" - "}
                      {m.room.type}
                    </p>
                  )}
                </div>
              </div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr
                    className={`border-b ${t ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <th
                      className={`text-left py-2 ${t ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Description
                    </th>
                    <th
                      className={`text-center py-2 ${t ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Qty
                    </th>
                    <th
                      className={`text-right py-2 ${t ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Rate
                    </th>
                    <th
                      className={`text-right py-2 ${t ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(m.items || []).map((j, A) => (
                    <tr
                      className={`border-b ${t ? "border-gray-700" : "border-gray-100"}`}
                      key={A}
                    >
                      <td
                        className={`py-2 ${t ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {j.description}
                      </td>
                      <td
                        className={`py-2 text-center ${t ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {j.quantity}
                      </td>
                      <td
                        className={`py-2 text-right ${t ? "text-gray-300" : "text-gray-700"}`}
                      >
                        ₹{j.rate?.toLocaleString()}
                      </td>
                      <td
                        className={`py-2 text-right font-medium ${t ? "text-white" : "text-gray-900"}`}
                      >
                        ₹{j.amount?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="space-y-1 text-sm border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className={t ? "text-white" : "text-gray-900"}>
                    ₹{m.subtotal?.toLocaleString()}
                  </span>
                </div>
                {m.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{m.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">GST ({m.taxRate}%)</span>
                  <span className={t ? "text-white" : "text-gray-900"}>
                    ₹{m.taxAmount?.toLocaleString()}
                  </span>
                </div>
                <div
                  className={`flex justify-between font-bold text-lg border-t pt-2 ${t ? "border-gray-700" : "border-gray-200"}`}
                >
                  <span className={t ? "text-white" : "text-gray-900"}>
                    Total
                  </span>
                  <span className="text-amber-600">
                    ₹{m.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => h(null)}
                  className={`flex-1 border py-2.5 rounded-xl text-sm ${t ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}
                >
                  Close
                </button>
                <button
                  onClick={() => N(m)}
                  className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600"
                >
                  Print / Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
