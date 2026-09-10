export function DashboardHeader() {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-red-400">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Administration</h1>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
        <span className="text-sm text-slate-300">En ligne</span>
      </div>
    </header>
  );
}
