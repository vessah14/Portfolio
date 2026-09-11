"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  levelStyles,
  progressColors,
} from "@/data/about";
import type { SkillCategory, SkillItem, SkillLevel } from "@/data/about";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import { apiFetch } from "@/lib/api";

type ApiCompetence = {
  id: string;
  nom: string;
  niveau: string;
  progression: number;
  create_at: string;
};

const skillCategoryDefinitions = [
  {
    title: "Frontend",
    icon: "💻",
    keywords: [
      "react",
      "next",
      "html",
      "css",
      "tailwind",
      "typescript",
      "javascript",
      "vue",
      "frontend",
      "ui",
      "ux",
      "sass",
      "bootstrap",
      "redux",
      "angular",
      "svelte",
      "material ui",
      "shadcn",
    ],
  },
  {
    title: "Backend",
    icon: "⚙️",
    keywords: [
      "node",
      "express",
      "asp.net",
      "api",
      "backend",
      "postgres",
      "sql",
      "mysql",
      "mongodb",
      "python",
      "django",
      "php",
      "laravel",
      "java",
      "spring",
      "c#",
      "dotnet",
      "entity framework",
      "csharp",
      ".net",
      "fastapi",
      "flask",
      "nestjs",
      "redis",
    ],
  },
  {
    title: "Design",
    icon: "🎨",
    keywords: [
      "figma",
      "photoshop",
      "illustrator",
      "adobe",
      "design",
      "brand",
      "graphic",
      "ux",
      "ui",
      "after effects",
      "canva",
      "sketch",
      "adobe xd",
      "wireframe",
      "prototyp",
    ],
  },
] as const;

function isSkillLevel(value: string): value is SkillLevel {
  return value === "Expert" || value === "Avancé" || value === "Intermédiaire";
}

function classifySkill(name: string): SkillCategory["title"] {
  const normalizedName = name.toLowerCase();

  const category = skillCategoryDefinitions.find((definition) =>
    definition.keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  return category?.title ?? "Frontend";
}

export function SkillsSection() {
  const { t } = useLanguage();
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const apiCompetences = await apiFetch<ApiCompetence[]>("Competences");

        if (!Array.isArray(apiCompetences)) {
          throw new Error("La réponse API des compétences est invalide.");
        }

        const mappedSkills: SkillItem[] = apiCompetences.flatMap((competence) => {
          const name = competence.nom.trim();
          const level = competence.niveau.trim();

          if (!name || !isSkillLevel(level)) {
            return [];
          }

          return [
            {
              name,
              level,
              progress: Math.max(0, Math.min(100, competence.progression)),
            },
          ];
        });

        const groupedSkills = skillCategoryDefinitions.map((category) => ({
          title: category.title,
          icon: category.icon,
          skills: mappedSkills.filter(
            (skill) => classifySkill(skill.name) === category.title,
          ),
        }));

        setSkillCategories(
          groupedSkills.filter((category) => category.skills.length > 0),
        );
        setHasError(false);
      } catch {
        setSkillCategories([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      {isLoading && (
        <p className="text-sm text-gray-400">Chargement des compétences...</p>
      )}
      {hasError && (
        <p className="text-sm text-amber-300">
          Les compétences sont indisponibles actuellement.
        </p>
      )}
      {!isLoading && !hasError && skillCategories.length === 0 && (
        <p className="text-sm text-gray-400">{t.projects.noSkills}</p>
      )}
      {skillCategories.map((category) => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          key={category.title}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="text-xl">{category.icon}</span>
            <h3 className="text-lg font-bold text-white">{category.title}</h3>
          </div>

          <div className="space-y-5">
            {category.skills.map((skill, skillIndex) => (
              <div key={`${category.title}-${skill.name}-${skillIndex}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">
                    {skill.name}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelStyles[skill.level]}`}
                  >
                    {t.levels[skill.level]}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                  <div
                    className={`h-full rounded-full ${progressColors[skill.level]}`}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
