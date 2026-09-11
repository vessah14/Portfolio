"use client";

import { useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/lib/api";

type ApiMessage = {
  id: string;
  create_at: string;
};

type MonthPoint = {
  label: string;
  value: number;
};

function getRecentMonths(count: number): MonthPoint[] {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - count + index + 1, 1);

    return {
      label: formatter.format(date).replace(".", ""),
      value: 0,
    };
  });
}

export function MessagesChart() {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await apiFetch<ApiMessage[]>("Message");

        if (!Array.isArray(data)) {
          throw new Error("La réponse API des messages est invalide.");
        }

        setMessages(data);
        setHasError(false);
      } catch {
        setMessages([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  const monthlyData = useMemo(() => {
    const points = getRecentMonths(6);
    const firstPointDate = new Date();
    firstPointDate.setMonth(firstPointDate.getMonth() - 5, 1);
    firstPointDate.setHours(0, 0, 0, 0);

    messages.forEach((message) => {
      const createdAt = new Date(message.create_at);

      if (Number.isNaN(createdAt.getTime()) || createdAt < firstPointDate) {
        return;
      }

      const index =
        (createdAt.getFullYear() - firstPointDate.getFullYear()) * 12 +
        createdAt.getMonth() -
        firstPointDate.getMonth();

      if (index >= 0 && index < points.length) {
        points[index].value += 1;
      }
    });

    return points;
  }, [messages]);

  const maxValue = Math.max(...monthlyData.map((point) => point.value), 1);
  const hasDatedMessages = monthlyData.some((point) => point.value > 0);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Messages
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Évolution</h2>
        </div>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
          Données BD
        </span>
      </div>

      {isLoading && <p className="text-slate-400">Chargement...</p>}
      {hasError && (
        <p className="text-amber-300">Les messages sont indisponibles depuis l&apos;API.</p>
      )}
      {!isLoading && !hasError && !hasDatedMessages && (
        <p className="text-slate-400">Aucun message daté enregistré.</p>
      )}
      {!isLoading && !hasError && hasDatedMessages && (
        <>
          <div className="flex h-56 items-end gap-3">
            {monthlyData.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-cyan-400"
                  style={{ height: `${(point.value / maxValue) * 100}%`, minHeight: point.value ? "0.5rem" : 0 }}
                  title={`${point.value} message(s)`}
                />
                <span className="text-[10px] text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
