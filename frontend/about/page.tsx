"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { ContactSection } from "./components/ContactSection";
import { RealisationsSection } from "./components/RealisationsSection";
import { SkillsSection } from "./components/SkillsSection";
import { useLanguage } from "@/app/i18n/LanguageProvider";

const API_BASE_URL = "http://localhost:5054/api";

type ApiProject = {
  id: string;
  titre: string;
  description: string;
  photo_Url: string;
  categorieId: string;
  lien: string;
  create_at: string;
};

type ApiCategory = {
  id: string;
  nom: string;
};

type ApiCompetence = {
  id: number;
  nom: string;
  progression: number;
  create_at: string;
};

type StatItem = {
  value: string;
  label: string;
};

const defaultStats: StatItem[] = [
  { value: "0+", label: "Projets réalisés" },
  { value: "0+", label: "Projets créatifs" },
  { value: "0", label: "Domaines de compétence" },
  { value: "1+", label: "Années d'expérience" },
];

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
    <div className="text-white py-20 bg-black">
      <About />
    </div>
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
  const [stats, setStats] = useState<StatItem[]>(defaultStats);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projectsResponse, categoriesResponse, competencesResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/Projet`),
            fetch(`${API_BASE_URL}/Categories`),
            fetch(`${API_BASE_URL}/Competences`),
          ]);

        if (
          !projectsResponse.ok ||
          !categoriesResponse.ok ||
          !competencesResponse.ok
        ) {
          throw new Error("Impossible de récupérer les statistiques.");
        }

        const projectsPayload = (await projectsResponse.json()) as ApiProject[];
        const categoriesPayload = (await categoriesResponse.json()) as ApiCategory[];
        const competencesPayload = (await competencesResponse.json()) as ApiCompetence[];

        const apiProjects = Array.isArray(projectsPayload) ? projectsPayload : [];
        const apiCategories = Array.isArray(categoriesPayload)
          ? categoriesPayload
          : [];
        const apiCompetences = Array.isArray(competencesPayload)
          ? competencesPayload
          : [];

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

        const validTimestamps = apiProjects
          .map((project) => new Date(project.create_at).getTime())
          .filter((timestamp) => !Number.isNaN(timestamp));

        const yearsOfExperience =
          validTimestamps.length > 0
            ? Math.max(
                1,
                new Date().getFullYear() -
                  new Date(Math.min(...validTimestamps)).getFullYear() +
                  1,
              )
            : 1;

        setStats([
          { value: `${apiProjects.length}+`, label: "Projets réalisés" },
          {
            value: `${creativeProjectsCount}+`,
            label: "Projets créatifs",
          },
          {
            value: `${apiCompetences.length}`,
            label: "Domaines de compétence",
          },
          {
            value: `${yearsOfExperience}+`,
            label: "Années d'expérience",
          },
        ]);
      } catch {
        setStats(defaultStats);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            {t.about.eyebrow}
          </span>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-105">
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
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              {t.about.title}{" "}
              <span className="text-red-500">{t.about.highlight}</span>
            </h2>

            <div className="space-y-4 text-lg text-gray-400 leading-relaxed">
              <p>
                {t.about.first}
              </p>
              <p>
                {t.about.second}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Reactjs",
                "Nextjs",
                "HTML/CSS",
                "Tailwindcss",
                "Javascript & Typescript",
                "Asp.Net Core",
                "Adobe Photoshop & Illustrator",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-700 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                >
                  <div className="text-4xl font-extrabold text-red-500 md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-gray-300">{statLabels[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 space-y-6 bg-gray-950 py-20">
        <div className="mx-auto max-w-300 px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
            {t.about.skillsEyebrow}
          </h2>
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            {t.about.skillsTitle}
          </h2>
          <p className="space-y-4 text-lg text-gray-300 leading-relaxed">
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
