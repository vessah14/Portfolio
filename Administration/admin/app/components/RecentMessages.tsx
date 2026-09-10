import Link from "next/link";
import { recentMessages } from "@/app/data/dashboard";

export function RecentMessages() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Messages reçus</h2>
        <Link
          href="/messages"
          className="text-sm text-cyan-300 hover:text-cyan-200"
        >
          Voir tout
        </Link>
      </div>
      <div className="space-y-3">
        {recentMessages.map((message) => (
          <div
            key={message.name}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 font-semibold text-white">
                {message.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-white">{message.name}</p>
                <p className="text-sm text-slate-400">{message.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">{message.time}</span>
              {!message.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
