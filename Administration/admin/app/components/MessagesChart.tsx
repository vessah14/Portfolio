import { messageData } from "@/app/data/dashboard";

export function MessagesChart() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Messages
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Évolution</h2>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
          +9.2%
        </span>
      </div>
      <div className="flex h-56 items-end gap-3">
        {messageData.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-cyan-400"
              style={{ height: `${(value / 60) * 100}%` }}
              title={`${value} messages`}
            />
            <span className="text-[10px] text-slate-500">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
