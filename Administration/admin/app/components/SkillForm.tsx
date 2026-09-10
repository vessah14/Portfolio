"use client";

import { useState, type FormEvent } from "react";

export type SkillFormValue = {
  id?: string | number;
  name: string;
  level: string;
  progress: string;
};

const API_BASE_URL = "http://localhost:5054/api";

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
    const payload = {
      Nom: String(formData.get("Nom") || ""),
      Progression: Number(formData.get("Progression") || 0),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/Competences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("La compétence n'a pas pu être enregistrée.");
      }

      const savedSkill = await response.json();
      onSaved?.({
        id: savedSkill.id,
        name: String(savedSkill.nom || payload.Nom),
        level:
          savedSkill.progression >= 85
            ? "Expert"
            : savedSkill.progression >= 60
              ? "Avancé"
              : "Intermédiaire",
        progress: String(savedSkill.progression ?? payload.Progression),
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
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
          +1
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Nom</span>
          <input
            name="Nom"
            type="text"
            required
            placeholder="Node.js"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Progression</span>
          <input
            name="Progression"
            type="range"
            min="0"
            max="100"
            defaultValue="80"
            className="w-full accent-red-500"
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
