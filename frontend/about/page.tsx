"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ContactSection } from "./components/ContactSection";
import { RealisationsSection } from "./components/RealisationsSection";
import { SkillsSection } from "./components/SkillsSection";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import { apiFetch } from "@/lib/api";

type ApiProject = {
  categorieId: string;
};

type ApiCategory = {
  id: string;
  nom: string;
};

type ApiCompetence = {
  id: string;
};

type StatItem = {
  value: string;
  label: string;
};

const YEARS_OF_EXPERIENCE = 2;

const normalizeCategoryName = (value: string) => {
  const normalized = value.trim();

  const map: Record<string, string> = {
    design_graphique: "Design Graphique",
    developpement_web: "Développement web",
    ui_design: "UI Design",
    developpement: "Développement",
    design: "Design",
  };

  const lookupKey = normalized.toLowerCase();

  if (map[lookupKey]) {
    return map[lookupKey];
  }

  return normalized
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export default function Container() {
  return (
    <section id="about" className="scroll-mt-20 bg-black py-20 text-white">
      <About />
    </section>
  );
}

function About() {
  const { t } = useLanguage();
  const statLabels = [
    t.about.completed,
    t.about.creative,
    t.about.skills,
    t.about.experience,
  ];
  const [stats, setStats] = useState<StatItem[] | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [apiProjects, apiCategories, apiCompetences] = await Promise.all([
          apiFetch<ApiProject[]>("Projet"),
          apiFetch<ApiCategory[]>("Categories"),
          apiFetch<ApiCompetence[]>("Competences"),
        ]);

        if (
          !Array.isArray(apiProjects) ||
          !Array.isArray(apiCategories) ||
          !Array.isArray(apiCompetences)
        ) {
          throw new Error("La réponse API des statistiques est invalide.");
        }

        const categoryNames = new Map(
          apiCategories.map((category) => [
            category.id,
            normalizeCategoryName(category.nom),
          ]),
        );

        const creativeProjectsCount = apiProjects.filter((project) => {
          const categoryName = categoryNames.get(project.categorieId) ?? "";

          return (
            categoryName.toLowerCase().includes("design") ||
            categoryName.toLowerCase().includes("graphique")
          );
        }).length;

        setStats([
          { value: `${apiProjects.length}`, label: t.about.completed },
          { value: `${creativeProjectsCount}`, label: t.about.creative },
          { value: `${apiCompetences.length}`, label: t.about.skills },
          { value: `${YEARS_OF_EXPERIENCE}`, label: t.about.experience },
        ]);
        setStatsError(false);
      } catch {
        setStats(null);
        setStatsError(true);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [t.about.completed, t.about.creative, t.about.experience, t.about.skills]);

  return (
    <>
      <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-0.5 w-8 bg-red-500" />
            <span className="font-mono text-sm text-red-500">
              {t.about.eyebrow}
            </span>
          </div>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-105"
          >
            <div className="absolute inset-6 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-950 p-3 shadow-[0_30px_80px_rgba(239,68,68,0.2)]">
              <Image
                src="/photo.png"
                alt="Photo de profil"
                width={520}
                height={620}
                priority
                className="h-115 w-full rounded-[22px] object-cover object-center"
              />
            </div>

            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-red-500/40 bg-black/70 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <span aria-hidden="true">🎨</span>
              <span>Design</span>
            </div>
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {t.about.title} <span className="text-red-500">{t.about.highlight}</span>
            </h2>

            <div className="space-y-4 text-lg leading-relaxed text-gray-400">
              <p>{t.about.first}</p>
              <p>{t.about.second}</p>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              {isLoadingStats && (
                <p className="text-sm text-gray-400">Chargement des statistiques...</p>
              )}
              {statsError && (
                <p className="text-sm text-amber-300">
                  Les statistiques sont indisponibles actuellement.
                </p>
              )}
              {stats?.map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-700 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                >
                  <div className="text-4xl font-extrabold text-red-500 md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-gray-300">
                    {statLabels[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 space-y-6 bg-gray-950 py-20">
        <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-0.5 w-8 bg-red-500" />
            <span className="font-mono text-sm text-red-500">
              {t.about.skillsEyebrow}
            </span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            {t.about.skillsTitle}
          </h2>
          <p className="space-y-4 text-lg leading-relaxed text-gray-300">
            {t.about.skillsDescription}
          </p>
          <div>
            <SkillsSection />
          </div>
        </div>
      </div>

      <div className="bg-black">
        <RealisationsSection />
      </div>

      <div className="bg-black">
        <ContactSection />
      </div>
    </>
  );
}
