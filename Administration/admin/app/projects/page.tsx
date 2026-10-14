"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AddFormPanel } from "../components/AddFormPanel";
import { AdminAuthGuard } from "../components/AdminAuthGuard";
import {
  ProjectForm,
  type EditableProject,
  type ProjectFormValue,
} from "../components/ProjectForm";
import { Sidebar } from "../components/Sidebar";
import { apiFetch } from "@/lib/api";

type ApiProject = {
  id: string;
  titre: string;
  description: string;
  photo_Url: string;
  categorieId: string;
  lien: string;
  apkUrl?: string;
};

type ProjectListItem = {
  id: string;
  title: string;
  category: string;
  categorieId: string;
  image?: string;
  description: string;
  lien?: string;
  apkUrl?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [editingProject, setEditingProject] =
    useState<ProjectListItem | null>(null);

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

        const mappedProjects: ProjectListItem[] = apiProjects.map(
          (project) => ({
            id: project.id,
            title: project.titre,
            category: categoryMap[project.categorieId] ?? "",
            categorieId: project.categorieId,
            image: project.photo_Url || undefined,
            description: project.description,
            lien: project.lien || undefined,
            apkUrl: project.apkUrl || undefined,
          }),
        );

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
        categorieId: project.categorieId,
        image: project.image,
        description: project.description,
        lien: project.lien,
        apkUrl: project.apkUrl,
      },
      ...current,
    ]);
  };

  const handleUpdatedProject = (project: ProjectFormValue) => {
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              id: project.id,
              title: project.title,
              category: project.category,
              categorieId: project.categorieId,
              image: project.image,
              description: project.description,
              lien: project.lien,
              apkUrl: project.apkUrl,
            }
          : item,
      ),
    );
    setEditingProject(null);
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer le projet "${title}" ?`)) {
      return;
    }

    setDeleteError("");
    setDeletingId(id);

    try {
      await apiFetch(`Projet/${id}`, { method: "DELETE" });
      setProjects((current) => current.filter((project) => project.id !== id));
    } catch {
      setDeleteError("Impossible de supprimer ce projet pour le moment.");
    } finally {
      setDeletingId(null);
    }
  };

  const toEditableProject = (project: ProjectListItem): EditableProject => ({
    id: project.id,
    titre: project.title,
    categorieId: project.categorieId,
    lien: project.lien ?? "",
    description: project.description,
    apkUrl: project.apkUrl,
    photo_Url: project.image ?? "",
  });

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
                <span className="text-sm text-slate-400">
                  {projects.length}
                </span>
              </div>

              {isLoading && (
                <p className="text-slate-400">Chargement des projets...</p>
              )}
              {hasError && (
                <p className="text-amber-300">
                  Les projets sont indisponibles depuis l&apos;API.
                </p>
              )}
              {deleteError && (
                <p className="mb-4 text-sm text-rose-300">{deleteError}</p>
              )}
              {!isLoading && !hasError && projects.length === 0 && (
                <p className="text-slate-400">
                  Aucun projet enregistré pour le moment.
                </p>
              )}
              {!isLoading && !hasError && projects.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {projects.map((project) =>
                    editingProject?.id === project.id ? (
                      <div key={project.id} className="md:col-span-2 xl:col-span-3">
                        <ProjectForm
                          editingProject={toEditableProject(editingProject)}
                          onSaved={handleUpdatedProject}
                          onCancel={() => setEditingProject(null)}
                        />
                      </div>
                    ) : (
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
                              <p className="text-sm text-cyan-300">
                                {project.category}
                              </p>
                            )}
                          </div>

                          <p className="line-clamp-3 text-sm text-slate-400">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                            {project.apkUrl && (
                              <a
                                href={project.apkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200"
                              >
                                Télécharger l&apos;APK
                              </a>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingProject(project)}
                              className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteProject(project.id, project.title)
                              }
                              disabled={deletingId === project.id}
                              className="text-xs font-medium text-rose-400 transition hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === project.id
                                ? "Suppression..."
                                : "Supprimer"}
                            </button>
                          </div>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
