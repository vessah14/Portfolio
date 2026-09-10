"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    localStorage.setItem("vnatech-admin-auth", "true");
    router.push("/dashboard");
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
          <h1 className="mt-2 text-3xl font-bold text-white">Connexion</h1>
          <p className="mt-3 text-sm text-slate-400">
            Connectez-vous pour accéder au dashboard VNAtech.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <span className="mb-2 block text-sm text-slate-300">
              Mot de passe
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-red-500"
            />
          </label>
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-red-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Accéder au dashboard
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Vous n&apos;avez pas encore de compte ?{" "}
          <Link
            href="/signup"
            className="font-semibold text-red-400 transition hover:text-red-300"
          >
            S&apos;inscrire
          </Link>
        </p>
      </section>
    </main>
  );
}