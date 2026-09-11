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
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-colors hover:border-gray-700">
        <button
          type="button"
          onClick={() => hasImage && setIsModalOpen(true)}
          className="relative block h-48 w-full overflow-hidden"
          aria-label={`${t.projects.viewImage} ${project.title}`}
          disabled={!hasImage}
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
          {project.category && (
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-sky-400 backdrop-blur-sm">
              {project.category}
            </span>
          )}
        </button>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">{project.title}</h3>
            {project.year && <span className="text-sm text-gray-500">{project.year}</span>}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            {project.description}
          </p>

          {visibleTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-800 px-2.5 py-1 text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {remaining > 0 && (
                <span className="rounded-md bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
                  +{remaining}
                </span>
              )}
            </div>
          )}

          {hasProjectLink ? (
            <a
              href={project.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-400"
            >
              {t.projects.viewSite} →
            </a>
          ) : (
            <button
              type="button"
              onClick={() => hasImage && setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
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
