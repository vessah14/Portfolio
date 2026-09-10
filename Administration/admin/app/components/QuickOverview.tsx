import { quickOverview } from "@/app/data/dashboard";

export function QuickOverview() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold text-white">Aperçu rapide</h2>
      <div className="mt-6 space-y-4">
        {quickOverview.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className={`text-lg font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
