import { stats } from "@/app/data/dashboard";

export function StatCards() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{item.label}</span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${item.tone}`}
            >
              {item.trend}
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <span className="text-3xl font-bold text-white">{item.value}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Total
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
