import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useStore } from "../store/useStore.js";
import { housekeepingAPI, roomsAPI } from "../lib/api.js";

const PRIORITY_BADGE = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

const TASK_STATUS_BADGE = {
  PENDING: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  SKIPPED: "bg-slate-100 text-slate-600",
};

export function HousekeepingPage() {
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
      type: "CLEANING",
      priority: "MEDIUM",
      notes: "",
    });
  useEffect(() => {
    E();
  }, []);
  const E = async () => {
      g(true);
      const [M, H, X] = await Promise.all([
        housekeepingAPI.getAll(),
        housekeepingAPI.getStats(),
        roomsAPI.getAll(),
      ]);
      (l(M), u(H), m(X), g(false));
    },
    D = n.filter((M) => p === "ALL" || M.status === p),
    P = async (M, H) => {
      (await housekeepingAPI.updateStatus(M, H),
        await E(),
        toast.success(`Task status updated to ${H}`),
        w(null));
    },
    k = async (M, H) => {
      const X = [...M.checklist];
      ((X[H] = { ...X[H], completed: !X[H].completed }),
        await housekeepingAPI.updateChecklist(M.id, X),
        await E());
      const R = n.find(($) => $.id === M.id);
      R && w({ ...R, checklist: X });
    },
    _ = async () => {
      if (!A.roomId) {
        toast.error("Please select a room");
        return;
      }
      (d.find((M) => M.id === A.roomId),
        await housekeepingAPI.create({
          roomId: A.roomId,
          assignedTo: t.userId || undefined,
          type: A.type,
          priority: A.priority,
          scheduledAt: new Date().toISOString(),
          notes: A.notes,
          checklist: [
            { item: "Change bed linens", completed: false },
            { item: "Clean bathroom", completed: false },
            { item: "Vacuum/mop floor", completed: false },
            { item: "Restock amenities", completed: false },
            { item: "Check minibar inventory", completed: false },
            { item: "Inspect for damages", completed: false },
          ],
        }),
        toast.success("Housekeeping task created!"),
        j(false),
        C({ roomId: "", type: "CLEANING", priority: "MEDIUM", notes: "" }),
        E());
    },
    L = `rounded-2xl border p-5 ${r ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold ${r ? "text-white" : "text-gray-900"}`}
        >
          Housekeeping
        </h1>
        <button
          onClick={() => j(true)}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600"
        >
          <PlusIcon className="w-4 h-4" />
          {" Add Task"}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "Total",
            value: o.total || 0,
            color: "from-gray-500 to-slate-600",
          },
          {
            label: "Pending",
            value: o.pending || 0,
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
            label: "High Priority",
            value: o.urgent || 0,
            color: "from-red-500 to-rose-600",
          },
        ].map((M) => (
          <div
            className={`rounded-xl p-4 bg-gradient-to-br ${M.color} text-white`}
            key={M.label}
          >
            <p className="text-2xl font-bold">{M.value}</p>
            <p className="text-white/80 text-sm">{M.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((M) => (
          <button
            onClick={() => b(M)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${p === M ? "bg-amber-500 text-white" : r ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            key={M}
          >
            {M.replace("_", " ")}
          </button>
        ))}
      </div>
      {h ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {D.map((M) => (
            <div
              onClick={() => w(M)}
              className={`${L} cursor-pointer hover:shadow-md transition-all`}
              key={M.id}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p
                    className={`font-bold ${r ? "text-white" : "text-gray-900"}`}
                  >
                    {"Room "}
                    {M.room?.number}
                  </p>
                  <p
                    className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {M.type.replace("_", " ")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${TASK_STATUS_BADGE[M.status]}`}
                  >
                    {M.status.replace("_", " ")}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[M.priority]}`}
                  >
                    {M.priority}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className={r ? "text-gray-400" : "text-gray-500"}>
                    Progress
                  </span>
                  <span className={r ? "text-gray-300" : "text-gray-700"}>
                    {M.checklist.filter((H) => H.completed).length}/
                    {M.checklist.length}
                  </span>
                </div>
                <div
                  className={`w-full h-1.5 rounded-full ${r ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  <div
                    className="h-1.5 rounded-full bg-amber-500"
                    style={{
                      width: `${M.checklist.length > 0 ? (M.checklist.filter((H) => H.completed).length / M.checklist.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              {M.assignee && (
                <p
                  className={`text-xs ${r ? "text-gray-400" : "text-gray-500"}`}
                >
                  {"👤 Assigned to: "}
                  {M.assignee.name}
                </p>
              )}
              {M.notes && (
                <p
                  className={`text-xs mt-1 ${r ? "text-gray-400" : "text-gray-500"}`}
                >
                  {"📝 "}
                  {M.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {S && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => w(null)}
        >
          <div
            className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${r ? "bg-gray-800" : "bg-white"} max-h-[90vh] overflow-y-auto`}
            onClick={(M) => M.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className={`text-lg font-bold ${r ? "text-white" : "text-gray-900"}`}
                >
                  {"Room "}
                  {S.room?.number}
                  {" - "}
                  {S.type}
                </h3>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${TASK_STATUS_BADGE[S.status]}`}
                  >
                    {S.status}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[S.priority]}`}
                  >
                    {S.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => w(null)}
                className={`p-1.5 rounded-lg ${r ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 mb-5">
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${r ? "text-gray-400" : "text-gray-500"}`}
              >
                Checklist
              </p>
              {S.checklist.map((M, H) => (
                <button
                  onClick={() => k(S, H)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${r ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                  key={H}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${M.completed ? "bg-green-500 border-green-500" : r ? "border-gray-600" : "border-gray-300"}`}
                  >
                    {M.completed && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${M.completed ? "line-through text-gray-400" : r ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {M.item}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {S.status === "PENDING" && (
                <button
                  onClick={() => P(S.id, "IN_PROGRESS")}
                  className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-600"
                >
                  Start Task
                </button>
              )}
              {S.status === "IN_PROGRESS" && (
                <button
                  onClick={() => P(S.id, "COMPLETED")}
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600"
                >
                  Mark Complete
                </button>
              )}
            </div>
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
            onClick={(M) => M.stopPropagation()}
          >
            <h3
              className={`text-lg font-bold mb-4 ${r ? "text-white" : "text-gray-900"}`}
            >
              Create Housekeeping Task
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Room *
                </label>
                <select
                  value={A.roomId}
                  onChange={(M) => C({ ...A, roomId: M.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                >
                  <option value="">Select Room</option>
                  {d.map((M) => (
                    <option value={M.id} key={M.id}>
                      {"Room "}
                      {M.number}
                      {" - "}
                      {M.type}
                      {" ("}
                      {M.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Type
                  </label>
                  <select
                    value={A.type}
                    onChange={(M) => C({ ...A, type: M.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {["CLEANING", "TURNDOWN", "INSPECTION", "DEEP_CLEAN"].map(
                      (M) => (
                        <option value={M} key={M}>
                          {M.replace("_", " ")}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={A.priority}
                    onChange={(M) => C({ ...A, priority: M.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200 bg-white"}`}
                  >
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map((M) => (
                      <option value={M} key={M}>
                        {M}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Notes
                </label>
                <textarea
                  value={A.notes}
                  onChange={(M) => C({ ...A, notes: M.target.value })}
                  rows={2}
                  className={`w-full border rounded-xl px-3 py-2 text-sm resize-none ${r ? "border-gray-600 bg-gray-700 text-white" : "border-gray-200"}`}
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
                onClick={_}
                className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-600"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
