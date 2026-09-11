"use client";

import { useState, type FormEvent } from "react";

import { apiFetch } from "@/lib/api";

export type SkillFormValue = {
  id: string;
  name: string;
  level: string;
  progress: string;
  create_at: string;
};

type CreatedSkill = {
  id: string;
  nom: string;
  niveau: string;
  progression: number;
  create_at: string;
};

export function SkillForm({
  onSaved,
}: {
  onSaved?: (skill: SkillFormValue) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("Nom") ?? "").trim();
    const progressionValue = String(formData.get("Progression") ?? "");
    const progression = Number(progressionValue);

    if (!name || progressionValue === "" || !Number.isFinite(progression)) {
      setSubmitMessage("Le nom et la progression sont requis.");
      setIsSubmitting(false);
      return;
    }

    try {
      const savedSkill = await apiFetch<CreatedSkill>("Competences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Nom: name,
          Progression: progression,
        }),
      });

      if (
        !savedSkill.id ||
        !savedSkill.nom ||
        !savedSkill.niveau ||
        !Number.isFinite(savedSkill.progression) ||
        !savedSkill.create_at
      ) {
        throw new Error("La réponse du serveur est incomplète.");
      }

      onSaved?.({
        id: savedSkill.id,
        name: savedSkill.nom,
        level: savedSkill.niveau,
        progress: String(savedSkill.progression),
        create_at: savedSkill.create_at,
      });

      setSubmitMessage("Compétence enregistrée avec succès.");
      event.currentTarget.reset();
    } catch {
      setSubmitMessage(
        "Une erreur est survenue lors de l'enregistrement de la compétence.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Ajouter une compétence
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Nom</span>
          <input
            name="Nom"
            type="text"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Progression</span>
          <input
            name="Progression"
            type="number"
            min="0"
            max="100"
            step="1"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
        </label>
        {submitMessage && (
          <p className="text-sm text-emerald-300">{submitMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-400"
        >
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}
