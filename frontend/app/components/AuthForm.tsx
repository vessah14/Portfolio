"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type AuthMode = "login" | "signup";

type StoredUser = {
  name: string;
  email: string;
  password: string;
};

const storageKey = "vnatech-user";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (isSignup) {
      if (password !== confirmation) {
        setFeedback({
          type: "error",
          message: "Les mots de passe ne correspondent pas.",
        });
        return;
      }

      const user: StoredUser = { name, email, password };
      localStorage.setItem(storageKey, JSON.stringify(user));
      setFeedback({
        type: "success",
        message: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      });
      setPassword("");
      setConfirmation("");
      return;
    }

    const storedUser = localStorage.getItem(storageKey);
    const user = storedUser ? (JSON.parse(storedUser) as StoredUser) : null;

    if (!user || user.email !== email || user.password !== password) {
      setFeedback({
        type: "error",
        message: "Email ou mot de passe incorrect.",
      });
      return;
    }

    setFeedback({
      type: "success",
      message: `Bienvenue ${user.name} ! Connexion réussie.`,
    });
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-950 px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-red-500">
            VNAtech
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-white">
            {isSignup ? "Créer un compte" : "Se connecter"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            {isSignup
              ? "Inscrivez-vous pour retrouver votre espace personnel."
              : "Accédez à votre espace personnel VNAtech."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm text-gray-300">Nom complet</span>
              <input
                required
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jean Dupont"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Adresse email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jean@exemple.com"
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Mot de passe</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="6 caractères minimum"
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
            />
          </label>

          {isSignup && (
            <label className="block">
              <span className="mb-2 block text-sm text-gray-300">
                Confirmer le mot de passe
              </span>
              <input
                required
                minLength={6}
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="Répétez votre mot de passe"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
              />
            </label>
          )}

          {feedback && (
            <p
              role="status"
              className={`rounded-xl border px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {feedback.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-red-500 py-3.5 font-semibold text-white transition-colors hover:bg-red-600"
          >
            {isSignup ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isSignup ? "Vous avez déjà un compte ?" : "Vous n'avez pas encore de compte ?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-red-400 transition hover:text-red-300"
          >
            {isSignup ? "Se connecter" : "S'inscrire"}
          </Link>
        </p>
      </section>
    </main>
  );
}