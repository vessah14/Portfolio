"use client";

import { useEffect, useState } from "react";

import { AddFormPanel } from "../components/AddFormPanel";
import { ProjectForm, type ProjectFormValue } from "../components/ProjectForm";
import { Sidebar } from "../components/Sidebar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api";

type ApiProject = {
  id: string;
  titre: string;
  description: string;
  photo_Url: string;
  categorieId: string;
  lien: string;
  create_at: string;
};

type ProjectListItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  lien: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        const apiProjects: ApiProject[] = await projectsResponse.json();
        const apiCategories: Array<{ id: string; nom: string }> =
          await categoriesResponse.json();

        const categoryMap = Object.fromEntries(
          apiCategories.map((category) => [category.id, category.nom]),
        );

        const mappedProjects: ProjectListItem[] = apiProjects.map((project) => ({
          id: project.id,
          title: project.titre,
          category: categoryMap[project.categorieId] ?? "Autre",
          image: project.photo_Url || "/projects/default.png",
          description: project.description,
          lien: project.lien || "",
        }));

        setProjects(mappedProjects);
      } catch {
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleSavedProject = (project: ProjectFormValue) => {
    setProjects((current) => [
      {
        id: project.id ?? `temp-${Date.now()}`,
        title: project.title,
        category: project.category || "Autre",
        image: project.image || "/projects/default.png",
        description: project.description || "",
        lien: project.lien || "",
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

            {isLoading ? (
              <p className="text-slate-400">Chargement des projets...</p>
            ) : projects.length === 0 ? (
              <p className="text-slate-400">
                Aucun projet enregistré pour le moment.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-44 w-full object-cover"
                    />
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {project.title}
                          </h3>
                          <p className="text-sm text-cyan-300">
                            {project.category}
                          </p>
                        </div>
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
  );
}
