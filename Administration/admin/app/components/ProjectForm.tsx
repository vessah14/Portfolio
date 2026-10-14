"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { apiFetch } from "@/lib/api";

export type ProjectFormValue = {
  id: string;
  title: string;
  category: string;
  categorieId: string;
  image: string;
  description: string;
  lien: string;
  apkUrl?: string;
};

export type EditableProject = {
  id: string;
  titre: string;
  categorieId: string;
  lien: string;
  description: string;
  apkUrl?: string;
  photo_Url: string;
};

type CategoryOption = {
  id: string;
  nom: string;
};

type CreatedProject = {
  id: string;
  titre: string;
  description: string;
  photo_Url: string;
  categorieId: string;
  lien: string;
  apkUrl?: string;
};

const normalizeCategoryName = (value: string) => {
  const normalized = value.trim();

  const map: Record<string, string> = {
    design_graphique: "Design Graphique",
    developpement_web: "Développement web",
    developpement_mobile: "Développement Mobile",
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

export function ProjectForm({
  editingProject,
  onSaved,
  onCancel,
}: {
  editingProject?: EditableProject;
  onSaved?: (project: ProjectFormValue) => void;
  onCancel?: () => void;
}) {
  const isEditing = Boolean(editingProject);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiFetch<CategoryOption[]>("Categories");

        if (!Array.isArray(data)) {
          throw new Error("La réponse API des catégories est invalide.");
        }

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
    const hasFile = file instanceof File && file.size > 0;

    if (!isEditing && !hasFile) {
      setSubmitMessage("Une image est requise pour créer un projet.");
      setIsSubmitting(false);
      return;
    }

    if (!hasFile) {
      formData.delete("file");
    }

    try {
      const savedProject = isEditing
        ? await apiFetch<CreatedProject>(`Projet/${editingProject!.id}`, {
            method: "PUT",
            body: formData,
          })
        : await apiFetch<CreatedProject>("Projet", {
            method: "POST",
            body: formData,
          });
      const categoryName = categories.find(
        (category) => category.id === savedProject.categorieId,
      )?.nom;

      if (
        !savedProject.id ||
        !savedProject.titre ||
        !savedProject.description ||
        !savedProject.photo_Url ||
        !savedProject.lien ||
        !categoryName
      ) {
        throw new Error("La réponse du serveur est incomplète.");
      }

      onSaved?.({
        id: savedProject.id,
        title: savedProject.titre,
        category: categoryName,
        categorieId: savedProject.categorieId,
        image: savedProject.photo_Url,
        description: savedProject.description,
        lien: savedProject.lien,
        apkUrl: savedProject.apkUrl || undefined,
      });

      setSubmitMessage(
        isEditing
          ? "Projet modifié avec succès."
          : "Projet enregistré avec succès.",
      );

      if (!isEditing) {
        event.currentTarget.reset();
        removeImage();
      }
    } catch {
      setSubmitMessage(
        isEditing
          ? "Une erreur est survenue lors de la modification du projet."
          : "Une erreur est survenue lors de l'enregistrement du projet.",
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
        <h2 className="text-2xl font-bold text-white">
          {isEditing ? "Modifier le projet" : "Ajouter un projet"}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Titre</span>
          <input
            name="titre"
            type="text"
            required
            defaultValue={editingProject?.titre}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Catégorie</span>
          <select
            name="CategorieId"
            required
            defaultValue={editingProject?.categorieId ?? ""}
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
            defaultValue={editingProject?.lien}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">
            Lien de l&apos;APK (optionnel, pour les projets React Native)
          </span>
          <input
            name="ApkUrl"
            type="url"
            placeholder="https://github.com/.../app-release.apk"
            defaultValue={editingProject?.apkUrl}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">Description</span>
          <textarea
            name="Description"
            rows={4}
            required
            defaultValue={editingProject?.description}
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </label>
        <div className="md:col-span-2">
          <span className="mb-2 block text-sm text-slate-300">
            Image du projet
            {isEditing && " (laisser vide pour conserver l’image actuelle)"}
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
            ) : isEditing && editingProject?.photo_Url ? (
              <div className="relative w-full max-w-sm">
                <Image
                  src={editingProject.photo_Url}
                  alt="Image actuelle du projet"
                  width={800}
                  height={600}
                  className="h-48 w-full rounded-xl object-cover opacity-80"
                />
                <span className="mt-3 block text-sm text-slate-400">
                  Image actuelle — cliquez pour la remplacer
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
          <p className="text-sm text-emerald-300 md:col-span-2">
            {submitMessage}
          </p>
        )}
        <div className="flex justify-end gap-3 md:col-span-2">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-400/70"
          >
            {isSubmitting
              ? "Enregistrement..."
              : isEditing
                ? "Modifier le projet"
                : "Enregistrer le projet"}
          </button>
        </div>
      </form>
    </div>
  );
}
