"use client";

import { useEffect, useState } from "react";

import { AdminAuthGuard } from "../components/AdminAuthGuard";
import { Sidebar } from "../components/Sidebar";
import { apiFetch } from "@/lib/api";

type ApiMessage = {
  id: string;
  nom_envoyeur: string;
  email_envoyeur: string;
  message: string;
  create_at: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await apiFetch<ApiMessage[]>("Message");

        if (!Array.isArray(data)) {
          throw new Error("La réponse API des messages est invalide.");
        }

        setMessages(data);
        setHasError(false);
      } catch {
        setMessages([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Communication
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Messages reçus
              </h1>
              <p className="mt-2 text-slate-400">
                Retrouvez ici les demandes envoyées depuis votre portfolio.
              </p>
            </div>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              {isLoading && (
                <p className="text-slate-400">Chargement des messages...</p>
              )}
              {hasError && (
                <p className="text-amber-300">
                  Les messages sont indisponibles depuis l&apos;API.
                </p>
              )}
              {!isLoading && !hasError && messages.length === 0 && (
                <p className="text-slate-400">
                  Aucun message reçu pour le moment.
                </p>
              )}
              {!isLoading && !hasError && messages.length > 0 && (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-violet-500 font-semibold text-white">
                          {message.nom_envoyeur.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {message.nom_envoyeur}
                          </p>
                          <p className="text-sm text-slate-400">
                            {message.email_envoyeur}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(message.create_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-slate-300 sm:items-end">
                        <p className="max-w-xl whitespace-pre-wrap leading-relaxed">
                          {message.message}
                        </p>
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
