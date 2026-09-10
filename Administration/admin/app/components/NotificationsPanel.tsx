import { notifications } from "@/app/data/dashboard";

export function NotificationsPanel() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
          3
        </span>
      </div>
      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.title}
            className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
          >
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.type === "info" ? "bg-cyan-400" : item.type === "success" ? "bg-emerald-400" : "bg-amber-400"}`}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-white">{item.title}</p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
