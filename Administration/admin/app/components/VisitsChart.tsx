import { months } from "@/app/data/dashboard";

export function VisitsChart() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Visites
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Suivi des visites
          </h2>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
          +18.4%
        </span>
      </div>
      <div className="h-56 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
        <svg
          viewBox="0 0 600 220"
          className="h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Graphique des visites"
        >
          <defs>
            <linearGradient id="visitFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1="0"
              x2="600"
              y1={22 + line * 52}
              y2={22 + line * 52}
              stroke="#334155"
              strokeDasharray="4 8"
            />
          ))}
          <path
            d="M0,160 C60,140 90,110 120,120 S200,80 230,100 S290,50 330,60 S390,30 430,90 S500,70 600,40 L600,220 L0,220 Z"
            fill="url(#visitFill)"
          />
          <path
            d="M0,160 C60,140 90,110 120,120 S200,80 230,100 S290,50 330,60 S390,30 430,90 S500,70 600,40"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        {months.map((month, index) => (
          <span key={`${month}-${index}`}>{month}</span>
        ))}
      </div>
    </div>
  );
}
