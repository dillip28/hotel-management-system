import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";
import {
  DollarSignIcon,
  PlusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useStore } from "../store/useStore.js";
import { ledgerAPI } from "../lib/api.js";

const LEDGER_TYPE_BADGE = {
  INCOME: "bg-green-100 text-green-700",
  EXPENSE: "bg-red-100 text-red-700",
  SALARY: "bg-purple-100 text-purple-700",
  VENDOR: "bg-orange-100 text-orange-700",
  UTILITY: "bg-blue-100 text-blue-700",
};

export function LedgerPage() {
  const { ui: e, auth: t } = useStore(),
    { darkMode: r } = e,
    [n, l] = useState([]),
    [o, u] = useState({}),
    [d, m] = useState(true),
    [h, g] = useState("ALL"),
    [p, b] = useState(false),
    [S, w] = useState({
      type: "INCOME",
      category: "Room Revenue",
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  useEffect(() => {
    N();
  }, [h]);
  const N = async () => {
      m(true);
      const [C, E] = await Promise.all([
        ledgerAPI.getAll(h === "ALL" ? undefined : h),
        ledgerAPI.getStats(),
      ]);
      (l(C), u(E), m(false));
    },
    j = async () => {
      if (!S.description || !S.amount) {
        toast.error("Please fill in all required fields");
        return;
      }
      const C = Number(S.amount);
      (await ledgerAPI.create({
        type: S.type,
        category: S.category,
        description: S.description,
        amount: C,
        debit: S.type !== "INCOME" ? C : 0,
        credit: S.type === "INCOME" ? C : 0,
        date: S.date,
        enteredBy: t.userId || "system",
        notes: S.notes,
      }),
        toast.success("Ledger entry added!"),
        b(false),
        w({
          type: "INCOME",
          category: "Room Revenue",
          description: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
        }),
        N());
    },
    A = `rounded-2xl border p-5 ${r ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${r ? "text-white" : "text-gray-900"}`}
        >
          Accounts Ledger
        </h1>
        <button
          onClick={() => b(true)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <PlusIcon className="w-4 h-4" />
          {" Add Entry"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-5 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <TrendingUpIcon className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-bold">
            ₹{(o.totalIncome || 0).toLocaleString()}
          </p>
          <p className="text-white/80 text-sm">Total Income</p>
        </div>
        <div className="rounded-xl p-5 bg-gradient-to-br from-red-500 to-rose-600 text-white">
          <TrendingDownIcon className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-bold">
            ₹{(o.totalExpenses || 0).toLocaleString()}
          </p>
          <p className="text-white/80 text-sm">Total Expenses</p>
        </div>
        <div className="rounded-xl p-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <DollarSignIcon className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-bold">
            ₹{(o.netProfit || 0).toLocaleString()}
          </p>
          <p className="text-white/80 text-sm">
            {"Net Profit • "}
            {o.profitMargin || 0}% margin
          </p>
        </div>
      </div>
      {o.monthlyData && o.monthlyData.length > 0 && (
        <div className={A}>
          <h3
            className={`font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
          >
            {"Monthly P&L"}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={o.monthlyData.slice(-6)}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={r ? "#374151" : "#f3f4f6"}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: r ? "#9ca3af" : "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: r ? "#9ca3af" : "#6b7280" }}
                tickFormatter={(C) => `₹${(C / 1e3).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: r ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "12px",
                }}
                formatter={(C) => [`₹${Number(C).toLocaleString()}`]}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
              <Bar
                dataKey="profit"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="flex gap-2">
        {["ALL", "INCOME", "EXPENSE", "SALARY", "UTILITY"].map((C) => (
          <button
            onClick={() => g(C)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${h === C ? "bg-amber-500 text-white" : r ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            key={C}
          >
            {C}
          </button>
        ))}
      </div>
      <div className={A}>
        {d ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b ${r ? "border-gray-700" : "border-gray-100"}`}
                >
                  {[
                    "Date",
                    "Type",
                    "Category",
                    "Description",
                    "Debit",
                    "Credit",
                    "Amount",
                  ].map((C) => (
                    <th
                      className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide ${r ? "text-gray-400" : "text-gray-500"}`}
                      key={C}
                    >
                      {C}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {n.map((C) => (
                  <tr
                    className={`border-b ${r ? "border-gray-700" : "border-gray-50"}`}
                    key={C.id}
                  >
                    <td className="py-3 px-3 text-xs text-gray-500">
                      {C.date}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEDGER_TYPE_BADGE[C.type] || "bg-gray-100 text-gray-600"}`}
                      >
                        {C.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs">{C.category}</td>
                    <td className="py-3 px-3">
                      <p
                        className={`text-sm ${r ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {C.description}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      {C.debit > 0 && (
                        <span className="text-red-600 font-semibold text-sm">
                          ₹{C.debit.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {C.credit > 0 && (
                        <span className="text-green-600 font-semibold text-sm">
                          ₹{C.credit.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold text-sm ${r ? "text-white" : "text-gray-900"}`}
                      >
                        ₹{C.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {p && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => b(false)}
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${r ? "bg-gray-800" : "bg-white"}`}
            onClick={(C) => C.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
            >
              Add Ledger Entry
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Type
                  </label>
                  <select
                    value={S.type}
                    onChange={(C) => w({ ...S, type: C.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {["INCOME", "EXPENSE", "SALARY", "VENDOR", "UTILITY"].map(
                      (C) => (
                        <option value={C} key={C}>
                          {C}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={S.date}
                    onChange={(C) => w({ ...S, date: C.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Category
                </label>
                <input
                  value={S.category}
                  onChange={(C) => w({ ...S, category: C.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Description *
                </label>
                <input
                  value={S.description}
                  onChange={(C) => w({ ...S, description: C.target.value })}
                  placeholder="Enter description"
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={S.amount}
                  onChange={(C) => w({ ...S, amount: C.target.value })}
                  placeholder="0"
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Notes
                </label>
                <textarea
                  value={S.notes}
                  onChange={(C) => w({ ...S, notes: C.target.value })}
                  rows={2}
                  className={`w-full border rounded-xl px-3 py-2 text-sm resize-none ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => b(false)}
                className={`flex-1 border py-2.5 rounded-xl text-sm ${r ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}
              >
                Cancel
              </button>
              <button
                onClick={j}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
