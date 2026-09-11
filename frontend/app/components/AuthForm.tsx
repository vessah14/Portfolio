"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { apiFetch } from "@/lib/api";

type AuthMode = "login" | "signup";

type LoginResponse = {
  token?: string;
  Token?: string;
};

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (isSignup && password !== confirmation) {
      setFeedback({
        type: "error",
        message: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        await apiFetch("User/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nom: name,
            Prenom: firstName,
            Email: email,
            Password: password,
          }),
        });
        setFeedback({
          type: "success",
          message: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
        });
        setPassword("");
        setConfirmation("");
        return;
      }

      await apiFetch<LoginResponse>("User/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });
      setFeedback({
        type: "success",
        message: "Connexion réussie.",
      });
    } catch {
      setFeedback({
        type: "error",
        message: "L'API n'a pas pu traiter votre demande.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-950 px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-red-500">
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
            <>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-300">Nom</span>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="family-name"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-300">Prénom</span>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Adresse email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
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
              autoComplete={isSignup ? "new-password" : "current-password"}
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
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
              />
            </label>
          )}

          {feedback && (
            <p
              role={feedback.type === "error" ? "alert" : "status"}
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
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-500 py-3.5 font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Traitement..."
              : isSignup
                ? "Créer mon compte"
                : "Se connecter"}
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
