"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import type { Project } from "@/data/about";
import { ProjectCard } from "./ProjectCard";
import { useLanguage } from "@/app/i18n/LanguageProvider";

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

type ApiEnvelope<T> = {
  value?: T[];
};

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

const API_BASE_URL = "http://localhost:5054/api";

export function RealisationsSection() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tous"]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [projectsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/Projet`),
          fetch(`${API_BASE_URL}/Categories`),
        ]);

        if (!projectsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Impossible de récupérer les projets.");
        }

        const projectsPayload = (await projectsResponse.json()) as
          | ApiProject[]
          | ApiEnvelope<ApiProject>;
        const categoriesPayload = (await categoriesResponse.json()) as
          | ApiCategory[]
          | ApiEnvelope<ApiCategory>;

        const apiProjects = Array.isArray(projectsPayload)
          ? projectsPayload
          : projectsPayload.value ?? [];

        const apiCategories = Array.isArray(categoriesPayload)
          ? categoriesPayload
          : categoriesPayload.value ?? [];

        const categoryMap = new Map(
          apiCategories.map((category) => [
            category.id,
            normalizeCategoryName(category.nom),
          ]),
        );

        const mappedProjects: Project[] = apiProjects.map((project) => ({
          id: project.id,
          title: project.titre,
          year: new Date(project.create_at).getFullYear(),
          category: categoryMap.get(project.categorieId) ?? "Autre",
          description: project.description,
          image: project.photo_Url || undefined,
          lien: project.lien || undefined,
          tags: [],
        }));

        const nextProjects = mappedProjects.length > 0 ? mappedProjects : [];
        const nextCategories =
          apiCategories.length > 0
            ? Array.from(
                new Set([
                  "Tous",
                  ...apiCategories.map((category) =>
                    normalizeCategoryName(category.nom),
                  ),
                ]),
              )
            : ["Tous"];

        setProjects(nextProjects);
        setCategories(nextCategories);
      } catch {
        setProjects([]);
        setCategories(["Tous"]);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects =
    activeCategory === "Tous"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="projects" className="max-w-300 mx-auto px-6 py-16 scroll-mt-20">
      <h2 className="text-4xl font-extrabold text-white">{t.projects.title}</h2>
      <p className="mt-3 text-gray-400 max-w-xl">
        {t.projects.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
     className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </section>
  );
}
