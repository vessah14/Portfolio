"use client";

import { useState, type ReactNode } from "react";

export function AddFormPanel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={`mb-4 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
          isOpen
            ? "bg-red-500 hover:bg-red-400"
            : "bg-sky-500 hover:bg-sky-400"
        }`}
      >
        {isOpen ? "Fermer" : `Ajouter ${label}`}
      </button>
      {isOpen && children}
    </div>
  );
}