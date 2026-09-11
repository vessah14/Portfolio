"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api";

type Stat = {
  label: string;
  value: number;
  trend: string;
  tone: string;
};

export function StatCards() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [messagesResponse, projectsResponse, skillsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/Message`),
          fetch(`${API_BASE_URL}/Projet`),
          fetch(`${API_BASE_URL}/Competences`),
        ]);

        const messages = await messagesResponse.json();
        const projects = await projectsResponse.json();
        const skills = await skillsResponse.json();

        setStats([
          {
            label: "Messages reçus",
            value: Array.isArray(messages) ? messages.length : 0,
            trend: "+",
            tone: "bg-emerald-500/15 text-emerald-300",
          },
          {
            label: "Projets",
            value: Array.isArray(projects) ? projects.length : 0,
            trend: "+",
            tone: "bg-violet-500/15 text-violet-300",
          },
          {
            label: "Compétences",
            value: Array.isArray(skills) ? skills.length : 0,
            trend: "+",
            tone: "bg-amber-500/15 text-amber-300",
          },
        ]);
      } catch {
        setStats([
          { label: "Messages reçus", value: 0, trend: "+", tone: "bg-emerald-500/15 text-emerald-300" },
          { label: "Projets", value: 0, trend: "+", tone: "bg-violet-500/15 text-violet-300" },
          { label: "Compétences", value: 0, trend: "+", tone: "bg-amber-500/15 text-amber-300" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {isLoading ? (
        <p className="text-slate-400">Chargement des statistiques...</p>
      ) : (
        stats.map((item) => (
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
        ))
      )}
    </section>
  );
}
