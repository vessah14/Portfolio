'use client';

import { useState } from "react";
import Image from "next/image";

import type { Project } from "@/data/about";
import { useLanguage } from "@/app/i18n/LanguageProvider";

export function ProjectCard({ project }: { project: Project }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  const visibleTags = project.tags.slice(0, 3);
  const remaining = project.tags.length - visibleTags.length;
  const isDesignGraphic = project.category === "Design Graphique";
  const hasProjectLink = Boolean(project.lien) && !isDesignGraphic;
  const hasImage = Boolean(project.image);

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors">
        <button
          type="button"
          onClick={() => hasImage && setIsModalOpen(true)}
          className="relative h-48 w-full overflow-hidden block"
          aria-label={`${t.projects.viewImage} ${project.title}`}
        >
          {hasImage ? (
            <Image
              src={project.image!}
              alt={project.title}
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-800 text-sm text-gray-400">
              {t.projects.noImage}
            </div>
          )}
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-sky-400 text-xs font-medium px-3 py-1 rounded-full">
            {project.category}
          </span>
        </button>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">{project.title}</h3>
            <span className="text-gray-500 text-sm">{project.year}</span>
          </div>

          <p className="mt-2 text-gray-400 text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
            {remaining > 0 && (
              <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md">
                +{remaining}
              </span>
            )}
          </div>

          {hasProjectLink ? (
            <a
              href={project.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium"
            >
              {t.projects.viewSite} →
            </a>
          ) : (
            <button
              type="button"
              onClick={() => hasImage && setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium"
              disabled={!hasImage}
            >
              {isDesignGraphic ? t.projects.viewDetail : t.projects.viewDetails} →
            </button>
          )}
        </div>
      </div>

      {isModalOpen && hasImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="relative w-full max-w-4xl rounded-2xl border border-gray-700 bg-gray-950 p-3 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white hover:bg-black"
              aria-label={t.projects.close}
            >
              {t.projects.close}
            </button>

            <Image
              src={project.image!}
              alt={project.title}
              width={1400}
              height={1000}
              className="max-h-[80vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
