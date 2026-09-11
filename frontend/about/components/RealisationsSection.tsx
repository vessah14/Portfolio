"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import type { Project } from "@/data/about";
import { ProjectCard } from "./ProjectCard";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import { apiFetch } from "@/lib/api";

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

export function RealisationsSection() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [apiProjects, apiCategories] = await Promise.all([
          apiFetch<ApiProject[]>("Projet"),
          apiFetch<ApiCategory[]>("Categories"),
        ]);

        if (!Array.isArray(apiProjects) || !Array.isArray(apiCategories)) {
          throw new Error("La réponse API des projets est invalide.");
        }

        const categoryMap = new Map(
          apiCategories.map((category) => [
            category.id,
            normalizeCategoryName(category.nom),
          ]),
        );

        const mappedProjects: Project[] = apiProjects.map((project) => {
          const parsedYear = new Date(project.create_at).getFullYear();

          return {
            id: project.id,
            title: project.titre,
            year: Number.isNaN(parsedYear) ? null : parsedYear,
            category: categoryMap.get(project.categorieId) ?? "",
            description: project.description,
            image: project.photo_Url || undefined,
            lien: project.lien || undefined,
            tags: [],
          };
        });

        setProjects(mappedProjects);
        setCategories(
          Array.from(
            new Set(
              apiCategories
                .map((category) => normalizeCategoryName(category.nom))
                .filter(Boolean),
            ),
          ),
        );
        setHasError(false);
      } catch {
        setProjects([]);
        setCategories([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = activeCategory
    ? projects.filter((project) => project.category === activeCategory)
    : projects;

  return (
    <section id="projects" className="mx-auto max-w-300 scroll-mt-20 px-6 py-16">
      <h2 className="text-4xl font-extrabold text-white">{t.projects.title}</h2>
      <p className="mt-3 max-w-xl text-gray-400">{t.projects.description}</p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory("")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === ""
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {t.projects.all}
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <p className="mt-8 text-gray-400">Chargement des projets...</p>
      )}
      {hasError && (
        <p className="mt-8 text-amber-300">
          Les projets sont indisponibles actuellement.
        </p>
      )}
      {!isLoading && !hasError && filteredProjects.length === 0 && (
        <p className="mt-8 text-gray-400">{t.projects.noProjects}</p>
      )}

      {!isLoading && !hasError && filteredProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
