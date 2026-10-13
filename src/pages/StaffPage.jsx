import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { staffAPI } from "../lib/api.js";

export function StaffPage() {
  const { ui: e } = useStore(),
    { darkMode: t } = e,
    [r, n] = useState([]),
    [l, o] = useState(true),
    [u, d] = useState(false),
    [m, h] = useState({
      name: "",
      email: "",
      phone: "",
      role: "RECEPTIONIST",
      department: "Front Office",
      position: "",
      salary: "",
    });
  useEffect(() => {
    g();
  }, []);
  const g = async () => {
      o(true);
      const w = await staffAPI.getAll();
      (n(w), o(false));
    },
    p = async () => {
      if (!m.name || !m.email || !m.position) {
        toast.error("Fill required fields");
        return;
      }
      (await staffAPI.create(
        { name: m.name, email: m.email, phone: m.phone, role: m.role },
        {
          department: m.department,
          position: m.position,
          salary: Number(m.salary),
          employeeId: `EMP-${Date.now()}`,
        },
      ),
        toast.success("Staff member added!"),
        d(false),
        h({
          name: "",
          email: "",
          phone: "",
          role: "RECEPTIONIST",
          department: "Front Office",
          position: "",
          salary: "",
        }),
        g());
    },
    b = {
      HOTEL_ADMIN: "bg-purple-100 text-purple-700",
      RECEPTIONIST: "bg-blue-100 text-blue-700",
      ACCOUNTANT: "bg-green-100 text-green-700",
      HOUSEKEEPING: "bg-amber-100 text-amber-700",
      MAINTENANCE: "bg-red-100 text-red-700",
    },
    S = `rounded-2xl border p-5 ${t ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${t ? "text-white" : "text-gray-900"}`}
        >
          Staff Management
        </h1>
        <button
          onClick={() => d(true)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <PlusIcon className="w-4 h-4" />
          {" Add Staff"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className={`${S} text-center`}>
          <p className="text-2xl font-bold text-amber-500">{r.length}</p>
          <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
            Total Staff
          </p>
        </div>
        <div className={`${S} text-center`}>
          <p className="text-2xl font-bold text-green-500">
            {r.filter((w) => w.isActive).length}
          </p>
          <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
            Active
          </p>
        </div>
        <div className={`${S} text-center`}>
          <p className="text-2xl font-bold text-blue-500">
            ₹{r.reduce((w, N) => w + (N.salary || 0), 0).toLocaleString()}
          </p>
          <p className={`text-sm ${t ? "text-gray-400" : "text-gray-500"}`}>
            Monthly Payroll
          </p>
        </div>
      </div>
      <div className={S}>
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
                    "Employee",
                    "Employee ID",
                    "Department",
                    "Position",
                    "Role",
                    "Salary",
                    "Status",
                  ].map((w) => (
                    <th
                      className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide ${t ? "text-gray-400" : "text-gray-500"}`}
                      key={w}
                    >
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.map((w) => (
                  <tr
                    className={`border-b ${t ? "border-gray-700" : "border-gray-50"}`}
                    key={w.id}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {w.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${t ? "text-white" : "text-gray-900"}`}
                          >
                            {w.user?.name}
                          </p>
                          <p
                            className={`text-xs ${t ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {w.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-amber-600">
                      {w.employeeId}
                    </td>
                    <td className="py-3 px-3 text-sm">{w.department}</td>
                    <td className="py-3 px-3 text-sm">{w.position}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${b[w.user?.role] || "bg-gray-100 text-gray-600"}`}
                      >
                        {w.user?.role?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      ₹{(w.salary || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${w.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {w.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {u && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => d(false)}
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${t ? "bg-gray-800" : "bg-white"}`}
            onClick={(w) => w.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-4 ${t ? "text-white" : "text-gray-900"}`}
            >
              Add Staff Member
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Full Name *",
                  field: "name",
                  placeholder: "Employee Name",
                },
                {
                  label: "Email *",
                  field: "email",
                  placeholder: "employee@hotel.com",
                },
                {
                  label: "Phone",
                  field: "phone",
                  placeholder: "+91 XXXXX XXXXX",
                },
                {
                  label: "Position *",
                  field: "position",
                  placeholder: "e.g. Senior Receptionist",
                },
                {
                  label: "Monthly Salary (₹)",
                  field: "salary",
                  placeholder: "30000",
                },
              ].map((w) => (
                <div key={w.field}>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    {w.label}
                  </label>
                  <input
                    value={m[w.field]}
                    onChange={(N) => h({ ...m, [w.field]: N.target.value })}
                    placeholder={w.placeholder}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Role
                  </label>
                  <select
                    value={m.role}
                    onChange={(w) => h({ ...m, role: w.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {[
                      "HOTEL_ADMIN",
                      "RECEPTIONIST",
                      "ACCOUNTANT",
                      "HOUSEKEEPING",
                      "MAINTENANCE",
                    ].map((w) => (
                      <option value={w} key={w}>
                        {w.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Department
                  </label>
                  <select
                    value={m.department}
                    onChange={(w) => h({ ...m, department: w.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${t ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {[
                      "Front Office",
                      "Housekeeping",
                      "Finance",
                      "Engineering",
                      "F&B",
                      "Management",
                    ].map((w) => (
                      <option value={w} key={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => d(false)}
                className={`flex-1 border py-2.5 rounded-xl text-sm ${t ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}
              >
                Cancel
              </button>
              <button
                onClick={p}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
