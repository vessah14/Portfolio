"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AddFormPanel } from "../components/AddFormPanel";
import { AdminAuthGuard } from "../components/AdminAuthGuard";
import { ProjectForm, type ProjectFormValue } from "../components/ProjectForm";
import { Sidebar } from "../components/Sidebar";
import { apiFetch } from "@/lib/api";

type ApiProject = {
  id: string;
  titre: string;
  description: string;
  photo_Url: string;
  categorieId: string;
  lien: string;
};

type ProjectListItem = {
  id: string;
  title: string;
  category: string;
  image?: string;
  description: string;
  lien?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [apiProjects, apiCategories] = await Promise.all([
          apiFetch<ApiProject[]>("Projet"),
          apiFetch<Array<{ id: string; nom: string }>>("Categories"),
        ]);

        if (!Array.isArray(apiProjects) || !Array.isArray(apiCategories)) {
          throw new Error("La réponse API des projets est invalide.");
        }

        const categoryMap = Object.fromEntries(
          apiCategories.map((category) => [category.id, category.nom]),
        );

        const mappedProjects: ProjectListItem[] = apiProjects.map((project) => ({
          id: project.id,
          title: project.titre,
          category: categoryMap[project.categorieId] ?? "",
          image: project.photo_Url || undefined,
          description: project.description,
          lien: project.lien || undefined,
        }));

        setProjects(mappedProjects);
        setHasError(false);
      } catch {
        setProjects([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleSavedProject = (project: ProjectFormValue) => {
    setProjects((current) => [
      {
        id: project.id,
        title: project.title,
        category: project.category,
        image: project.image,
        description: project.description,
        lien: project.lien,
      },
      ...current,
    ]);
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Gestion
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">Projets</h1>
            <p className="mt-2 text-slate-400">
              Ajoutez et gérez les projets présentés sur votre portfolio.
            </p>
          </div>

          <div className="mb-10">
            <AddFormPanel label="un projet">
              <ProjectForm onSaved={handleSavedProject} />
            </AddFormPanel>
          </div>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Projets enregistrés
              </h2>
              <span className="text-sm text-slate-400">{projects.length}</span>
            </div>

            {isLoading && <p className="text-slate-400">Chargement des projets...</p>}
            {hasError && (
              <p className="text-amber-300">
                Les projets sont indisponibles depuis l&apos;API.
              </p>
            )}
            {!isLoading && !hasError && projects.length === 0 && (
              <p className="text-slate-400">
                Aucun projet enregistré pour le moment.
              </p>
            )}
            {!isLoading && !hasError && projects.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
                  >
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={450}
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center text-sm text-slate-500">
                        Image non fournie
                      </div>
                    )}
                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {project.title}
                        </h3>
                        {project.category && (
                          <p className="text-sm text-cyan-300">{project.category}</p>
                        )}
                      </div>

                      <p className="line-clamp-3 text-sm text-slate-400">
                        {project.description}
                      </p>

                      {project.lien && (
                        <a
                          href={project.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex text-sm font-medium text-red-300 hover:text-red-200"
                        >
                          Voir le site
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      </div>
    </AdminAuthGuard>
  );
}
