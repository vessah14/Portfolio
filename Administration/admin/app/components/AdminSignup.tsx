"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type AdminUser = {
  name: string;
  email: string;
  password: string;
};

export function AdminSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmation) {
      setHasError(true);
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const user: AdminUser = { name, email, password };
    localStorage.setItem("vnatech-admin-user", JSON.stringify(user));
    setHasError(false);
    setMessage("Compte créé. Vous pouvez maintenant vous connecter.");
    setPassword("");
    setConfirmation("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-2xl font-black text-white">
            V
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            Espace administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Inscription</h1>
          <p className="mt-3 text-sm text-slate-400">
            Créez votre compte administrateur VNAtech.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Nom complet</span>
            <input
              required
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Votre nom"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-red-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@vnatech.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-red-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Mot de passe</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="6 caractères minimum"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-red-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">
              Confirmer le mot de passe
            </span>
            <input
              required
              minLength={6}
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="Répétez votre mot de passe"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-red-500"
            />
          </label>
          {message && (
            <p
              className={`rounded-xl border px-4 py-3 text-sm ${
                hasError
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Créer mon compte
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/"
            className="font-semibold text-red-400 transition hover:text-red-300"
          >
            Se connecter
          </Link>
        </p>
      </section>
    </main>
  );
}