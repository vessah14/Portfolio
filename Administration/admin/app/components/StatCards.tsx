"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";

type ApiEntity = {
  id: string;
};

type Stat = {
  label: string;
  value: number;
  tone: string;
};

export function StatCards() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [messages, projects, skills] = await Promise.all([
          apiFetch<ApiEntity[]>("Message"),
          apiFetch<ApiEntity[]>("Projet"),
          apiFetch<ApiEntity[]>("Competences"),
        ]);

        if (
          !Array.isArray(messages) ||
          !Array.isArray(projects) ||
          !Array.isArray(skills)
        ) {
          throw new Error("La réponse API des statistiques est invalide.");
        }

        setStats([
          {
            label: "Messages reçus",
            value: messages.length,
            tone: "bg-emerald-500/15 text-emerald-300",
          },
          {
            label: "Projets",
            value: projects.length,
            tone: "bg-violet-500/15 text-violet-300",
          },
          {
            label: "Compétences",
            value: skills.length,
            tone: "bg-amber-500/15 text-amber-300",
          },
        ]);
        setHasError(false);
      } catch {
        setStats([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {isLoading && (
        <p className="text-slate-400">Chargement des statistiques...</p>
      )}
      {hasError && (
        <p className="text-amber-300">
          Les statistiques ne sont pas disponibles depuis l&apos;API.
        </p>
      )}
      {!isLoading && !hasError && stats.length === 0 && (
        <p className="text-slate-400">Aucune donnée enregistrée.</p>
      )}
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
              BD
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
