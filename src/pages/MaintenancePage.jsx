import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusIcon, WrenchIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { maintenanceAPI, roomsAPI } from "../lib/api.js";

const MAINTENANCE_PRIORITY_BADGE = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

const MAINTENANCE_STATUS_BADGE = {
  PENDING: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  SKIPPED: "bg-slate-100 text-slate-600",
};

export function MaintenancePage() {
  const { ui: e, auth: t } = useStore(),
    { darkMode: r } = e,
    [n, l] = useState([]),
    [o, u] = useState({}),
    [d, m] = useState([]),
    [h, g] = useState(true),
    [p, b] = useState("ALL"),
    [S, w] = useState(null),
    [N, j] = useState(false),
    [A, C] = useState({
      roomId: "",
      title: "",
      description: "",
      category: "HVAC",
      priority: "MEDIUM",
      estimatedCost: "",
    }),
    [E, D] = useState(""),
    [P, k] = useState("");
  useEffect(() => {
    _();
  }, []);
  const _ = async () => {
      g(true);
      const [$, J, ie] = await Promise.all([
        maintenanceAPI.getAll(),
        maintenanceAPI.getStats(),
        roomsAPI.getAll(),
      ]);
      (l($), u(J), m(ie), g(false));
    },
    L = n.filter(($) => p === "ALL" || $.status === p),
    M = async ($, J) => {
      const ie = {};
      (J === "COMPLETED" && P && (ie.actualCost = Number(P)),
        E && (ie.notes = E),
        await maintenanceAPI.updateStatus($, J, ie),
        await _(),
        toast.success(`Ticket status updated to ${J}`),
        w(null),
        D(""),
        k(""));
    },
    H = async () => {
      if (!A.title || !A.description) {
        toast.error("Please fill in all required fields");
        return;
      }
      (await maintenanceAPI.create({
        ...A,
        estimatedCost: A.estimatedCost ? Number(A.estimatedCost) : undefined,
        reportedBy: t.userId || "system",
        assignedTo: "u-maintenance",
      }),
        toast.success("Maintenance ticket created!"),
        j(false),
        C({
          roomId: "",
          title: "",
          description: "",
          category: "HVAC",
          priority: "MEDIUM",
          estimatedCost: "",
        }),
        _());
    },
    X = `rounded-2xl border p-5 ${r ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`,
    R = [
      "HVAC",
      "Plumbing",
      "Electrical",
      "Electronics",
      "Carpentry",
      "Painting",
      "Other",
    ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${r ? "text-white" : "text-gray-900"}`}
        >
          Maintenance
        </h1>
        <button
          onClick={() => j(true)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <PlusIcon className="w-4 h-4" />
          {" New Ticket"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Open Tickets",
            value: (o.pending || 0) + (o.inProgress || 0),
            color: "from-amber-500 to-orange-500",
          },
          {
            label: "In Progress",
            value: o.inProgress || 0,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Completed",
            value: o.completed || 0,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Est. Cost",
            value: `₹${(o.estimatedCost || 0).toLocaleString()}`,
            color: "from-red-500 to-rose-600",
          },
        ].map(($) => (
          <div
            className={`rounded-xl p-4 bg-gradient-to-br ${$.color} text-white`}
            key={$.label}
          >
            <p className="text-2xl font-bold">{$.value}</p>
            <p className="text-white/80 text-sm">{$.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map(($) => (
          <button
            onClick={() => b($)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${p === $ ? "bg-amber-500 text-white" : r ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            key={$}
          >
            {$.replace("_", " ")}
          </button>
        ))}
      </div>
      {h ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {L.map(($) => (
            <div
              onClick={() => w($)}
              className={`${X} cursor-pointer hover:shadow-md transition-all`}
              key={$.id}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${$.priority === "URGENT" || $.priority === "HIGH" ? "bg-red-100" : "bg-amber-100"}`}
                >
                  <WrenchIcon
                    className={`w-5 h-5 ${$.priority === "URGENT" || $.priority === "HIGH" ? "text-red-600" : "text-amber-600"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p
                        className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                      >
                        {$.title}
                      </p>
                      <p
                        className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {$.ticketNumber}
                        {" • "}
                        {$.category}
                      </p>
                      {$.room && (
                        <p
                          className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {"Room "}
                          {$.room.number}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${MAINTENANCE_STATUS_BADGE[$.status]}`}
                      >
                        {$.status.replace("_", " ")}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${MAINTENANCE_PRIORITY_BADGE[$.priority]}`}
                      >
                        {$.priority}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm mt-2 line-clamp-2 ${r ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {$.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    {$.estimatedCost && (
                      <span className="text-amber-600">
                        Est: ₹{$.estimatedCost.toLocaleString()}
                      </span>
                    )}
                    {$.actualCost && (
                      <span className="text-green-600">
                        Actual: ₹{$.actualCost.toLocaleString()}
                      </span>
                    )}
                    <span className={r ? "text-gray-500" : "text-gray-400"}>
                      {new Date($.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {L.length === 0 && (
            <div className="text-center py-12">
              <WrenchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className={r ? "text-gray-500" : "text-gray-400"}>
                No tickets found
              </p>
            </div>
          )}
        </div>
      )}
      {S && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => w(null)}
        >
          <div
            className={`max-w-lg w-full rounded-2xl p-6 shadow-2xl ${r ? "bg-gray-800" : "bg-white"} max-h-[90vh] overflow-y-auto`}
            onClick={($) => $.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className={`text-lg font-bold ${r ? "text-white" : "text-gray-900"}`}
                >
                  {S.title}
                </h3>
                <p className="text-xs text-amber-600 mt-0.5">
                  {S.ticketNumber}
                </p>
              </div>
              <button
                onClick={() => w(null)}
                className={`p-1.5 rounded-lg ${r ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p
                    className={`font-medium text-sm ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {S.category}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p className="text-xs text-gray-500 mb-1">Room</p>
                  <p
                    className={`font-medium text-sm ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {S.room ? `Room ${S.room.number}` : "N/A"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p className="text-xs text-gray-500 mb-1">Est. Cost</p>
                  <p
                    className={`font-medium text-sm ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {S.estimatedCost
                      ? `₹${S.estimatedCost.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <p className="text-xs text-gray-500 mb-1">Assignee</p>
                  <p
                    className={`font-medium text-sm ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {S.assignee?.name || "Unassigned"}
                  </p>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${r ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p
                  className={`text-sm ${r ? "text-gray-300" : "text-gray-700"}`}
                >
                  {S.description}
                </p>
              </div>
            </div>
            {S.status !== "COMPLETED" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Notes
                  </label>
                  <textarea
                    value={E}
                    onChange={($) => D($.target.value)}
                    rows={2}
                    className={`w-full border rounded-xl px-3 py-2 text-sm resize-none ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                    placeholder="Add progress notes..."
                  />
                </div>
                {S.status === "IN_PROGRESS" && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      Actual Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={P}
                      onChange={($) => k($.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                      placeholder="0"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  {S.status === "PENDING" && (
                    <button
                      onClick={() => M(S.id, "IN_PROGRESS")}
                      className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-600"
                    >
                      Start Work
                    </button>
                  )}
                  {S.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => M(S.id, "COMPLETED")}
                      className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {N && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => j(false)}
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${r ? "bg-gray-800" : "bg-white"}`}
            onClick={($) => $.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
            >
              Create Maintenance Ticket
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Room (Optional)
                </label>
                <select
                  value={A.roomId}
                  onChange={($) => C({ ...A, roomId: $.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                >
                  <option value="">Select Room (Optional)</option>
                  {d.map(($) => (
                    <option value={$.id} key={$.id}>
                      {"Room "}
                      {$.number}
                      {" - "}
                      {$.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Title *
                </label>
                <input
                  value={A.title}
                  onChange={($) => C({ ...A, title: $.target.value })}
                  placeholder="Brief issue description"
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Description *
                </label>
                <textarea
                  value={A.description}
                  onChange={($) => C({ ...A, description: $.target.value })}
                  rows={3}
                  className={`w-full border rounded-xl px-3 py-2 text-sm resize-none ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Category
                  </label>
                  <select
                    value={A.category}
                    onChange={($) => C({ ...A, category: $.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {R.map(($) => (
                      <option value={$} key={$}>
                        {$}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={A.priority}
                    onChange={($) => C({ ...A, priority: $.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map(($) => (
                      <option value={$} key={$}>
                        {$}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Estimated Cost (₹)
                </label>
                <input
                  type="number"
                  value={A.estimatedCost}
                  onChange={($) => C({ ...A, estimatedCost: $.target.value })}
                  placeholder="0"
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => j(false)}
                className={`flex-1 border py-2.5 rounded-xl text-sm ${r ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}
              >
                Cancel
              </button>
              <button
                onClick={H}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
