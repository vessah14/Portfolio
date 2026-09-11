"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
}

export function RecentMessages() {
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

        setMessages(data.slice(0, 4));
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Messages reçus</h2>
        <Link
          href="/messages"
          className="text-sm text-cyan-300 hover:text-cyan-200"
        >
          Voir tout
        </Link>
      </div>

      {isLoading && <p className="text-slate-400">Chargement...</p>}
      {hasError && (
        <p className="text-amber-300">Les messages sont indisponibles depuis l&apos;API.</p>
      )}
      {!isLoading && !hasError && messages.length === 0 && (
        <p className="text-slate-400">Aucun message enregistré.</p>
      )}
      {!isLoading && !hasError && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 font-semibold text-white">
                  {message.nom_envoyeur.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {message.nom_envoyeur}
                  </p>
                  <p className="truncate text-sm text-slate-400">
                    {message.message}
                  </p>
                </div>
              </div>
              <span className="ml-3 shrink-0 text-xs text-slate-500">
                {formatDate(message.create_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
