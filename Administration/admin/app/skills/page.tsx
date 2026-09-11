"use client";

import { useEffect, useState } from "react";

import { AddFormPanel } from "../components/AddFormPanel";
import { Sidebar } from "../components/Sidebar";
import { SkillForm, type SkillFormValue } from "../components/SkillForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api";

type ApiSkill = {
  id: string;
  nom: string;
  progression: number;
  create_at: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<ApiSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Competences`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer les compétences.");
        }

        const data: ApiSkill[] = await response.json();
        setSkills(data);
      } catch {
        setSkills([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handleSavedSkill = (skill: SkillFormValue) => {
    setSkills((current) => [
      {
        id: skill.id ?? Date.now(),
        nom: skill.name,
        progression: Number(skill.progress || 0),
        create_at: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
              Gestion
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">Compétences</h1>
            <p className="mt-2 text-slate-400">
              Ajoutez les compétences et indiquez votre niveau de maîtrise.
            </p>
          </div>

          <div className="mb-10 max-w-xl">
            <AddFormPanel label="une compétence">
              <SkillForm onSaved={handleSavedSkill} />
            </AddFormPanel>
          </div>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Compétences enregistrées
              </h2>
              <span className="text-sm text-slate-400">{skills.length}</span>
            </div>

            {isLoading ? (
              <p className="text-slate-400">Chargement des compétences...</p>
            ) : skills.length === 0 ? (
              <p className="text-slate-400">
                Aucune compétence enregistrée pour le moment.
              </p>
            ) : (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{skill.nom}</p>
                      <span className="text-sm text-red-300">
                        {skill.progression}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{ width: `${skill.progression}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
