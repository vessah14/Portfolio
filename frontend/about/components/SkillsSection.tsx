"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";  
import {
  levelStyles,
  progressColors,
  skillCategories as fallbackSkillCategories,
} from "@/data/about";
import type { SkillCategory, SkillItem, SkillLevel } from "@/data/about";
import { useLanguage } from "@/app/i18n/LanguageProvider";

type ApiCompetence = {
  id: string;
  nom: string;
  progression: number;
  create_at: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api";

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

function mapProgressToLevel(progress: number): SkillLevel {
  if (progress >= 85) {
    return "Expert";
  }

  if (progress >= 60) {
    return "Avancé";
  }

  return "Intermédiaire";
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
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(
    fallbackSkillCategories,
  );

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Competences`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer les compétences.");
        }

        const apiCompetences: ApiCompetence[] = await response.json();

        const mappedSkills: SkillItem[] = apiCompetences.map((competence) => ({
          name: competence.nom,
          level: mapProgressToLevel(competence.progression),
          progress: competence.progression,
        }));

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
      } catch {
        setSkillCategories(fallbackSkillCategories);
      }
    };

    loadSkills();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {skillCategories.map((category) => (
       <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
          key={category.title}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">{category.icon}</span>
            <h3 className="text-white font-bold text-lg">{category.title}</h3>
          </div>

          <div className="space-y-5">
            {category.skills.map((skill, skillIndex) => (
              <div key={`${category.title}-${skill.name}-${skillIndex}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-200 text-sm font-medium">
                    {skill.name}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${levelStyles[skill.level]}`}
                  >
                    {t.levels[skill.level]}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
