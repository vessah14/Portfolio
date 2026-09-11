"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

export type ProjectFormValue = {
  id?: string;
  title: string;
  category: string;
  image: string | null;
  description?: string;
  lien?: string;
};

type CategoryOption = {
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api";

export function ProjectForm({
  onSaved,
}: {
  onSaved?: (project: ProjectFormValue) => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Categories`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer les catégories.");
        }

        const data: CategoryOption[] = await response.json();
        setCategories(
          data.map((category) => ({
            ...category,
            nom: normalizeCategoryName(category.nom),
          })),
        );
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
    setImageName(file.name);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!file || !(file instanceof File) || file.size === 0) {
      setSubmitMessage("Une image est requise pour créer un projet.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Projet`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Le projet n'a pas pu être enregistré.");
      }

      const createdProject = await response.json();
      const categoryName =
        categories.find(
          (category) => category.id === createdProject.categorieId,
        )?.nom ?? "Autre";

      const normalizedProject = {
        id:
          createdProject.id ??
          createdProject.Id ??
          `temp-${Date.now()}`,
        title:
          String(
            createdProject.titre ?? createdProject.title ?? "Nouveau projet",
          ),
        category: categoryName,
        image:
          createdProject.photo_Url ||
          createdProject.photoUrl ||
          imagePreview ||
          "/projects/default.png",
        description: String(
          createdProject.description ??
            createdProject.Description ??
            "",
        ),
        lien: String(
          createdProject.lien ?? createdProject.Lien ?? "",
        ),
      };

      onSaved?.(normalizedProject);

      setSubmitMessage("Projet enregistré avec succès.");
      event.currentTarget.reset();
      removeImage();
    } catch {
      setSubmitMessage(
        "Une erreur est survenue lors de l'enregistrement du projet.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
    setImageName("");
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Ajouter un projet</h2>
        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
          Nouveau
        </span>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Titre</span>
          <input
            name="titre"
            type="text"
            required
            placeholder="Nom du projet"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Catégorie</span>
          <select
            name="CategorieId"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Lien</span>
          <input
            name="Lien"
            type="url"
            required
            placeholder="https://example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Description</span>
          <textarea
            name="Description"
            rows={4}
            required
            placeholder="Décrivez le projet..."
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <div className="md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">
            Image du projet
          </span>
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-4 text-center transition hover:border-cyan-400 hover:bg-slate-950">
            {imagePreview ? (
              <div className="relative w-full max-w-sm">
                <Image
                  src={imagePreview}
                  alt="Aperçu du projet"
                  width={800}
                  height={600}
                  className="h-48 w-full rounded-xl object-cover"
                />
                <span className="mt-3 block truncate text-sm text-slate-300">
                  {imageName}
                </span>
              </div>
            ) : (
              <>
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-2xl text-cyan-300">
                  ↑
                </span>
                <span className="text-sm font-semibold text-white">
                  Importer une image
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG ou WEBP · 5 Mo maximum
                </span>
              </>
            )}
            <input
              type="file"
              name="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
          {imagePreview && (
            <button
              type="button"
              onClick={removeImage}
              className="mt-2 text-xs font-medium text-rose-300 transition hover:text-rose-200"
            >
              Retirer l’image
            </button>
          )}
        </div>
        {submitMessage && (
          <p className="md:col-span-2 text-sm text-emerald-300">
            {submitMessage}
          </p>
        )}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-400/70"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer le projet"}
          </button>
        </div>
      </form>
    </div>
  );
}
