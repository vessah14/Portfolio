"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { clearAdminToken } from "@/lib/auth";

const navigationItems = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: "▦" },
  { label: "Projets", href: "/projects", icon: "◇" },
  { label: "Compétences", href: "/skills", icon: "✦" },
  { label: "Activité", href: "/activity", icon: "◷" },
  { label: "Messages", href: "/messages", icon: "✉" },
];

export function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    clearAdminToken();
    router.push("/");
  }

  return (
    <aside className="w-full shrink-0 border-b border-slate-800 bg-slate-900/95 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="sticky top-0 p-4 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-lg font-black text-white">
              V
            </div>
            <div>
              <p className="font-semibold text-white">VNAtech</p>
              <p className="text-xs text-slate-500">Espace administration</p>
            </div>
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-xl text-slate-300 transition hover:border-red-400 hover:text-white md:hidden"
          >
            {isOpen ? "×" : "☰"}
          </button>
        </div>

        <nav
          aria-label="Navigation principale"
          className={`${isOpen ? "block" : "hidden"} mt-8 md:block`}
        >
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Navigation
          </p>
          <div className="grid grid-cols-2 gap-2 md:block md:space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <span aria-hidden="true" className="w-5 text-center text-base">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full rounded-xl border border-slate-700 px-3 py-3 text-left text-sm text-slate-400 transition hover:border-red-400 hover:text-red-300"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
