"use client";

import { useLanguage } from "../i18n/LanguageProvider";

export default function SignupPage() {
  const { t } = useLanguage();
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-950 px-6 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm font-mono uppercase tracking-[0.2em] text-red-500">
          VNAtech
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-white">
          {t.access.title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-gray-400">
          {t.access.description}
        </p>
      </section>
    </main>
  );
}
