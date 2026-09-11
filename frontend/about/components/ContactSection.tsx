"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "lucide-react";

import { contactInfos, socials } from "@/data/about";
import { useLanguage } from "@/app/i18n/LanguageProvider";
import { apiFetch } from "@/lib/api";

export function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await apiFetch("Message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom_envoyeur: formData.name,
          email_envoyeur: formData.email,
          message: formData.message,
        }),
      });

      setSubmitMessage(t.contact.sent);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitMessage(t.contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-lg">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-0.5 w-8 bg-red-500" />
            <span className="font-mono text-sm text-red-500">{t.contact.eyebrow}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-gray-400">{t.contact.description}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {contactInfos.map((info) => {
              const Icon = info.icon;
              const Wrapper = info.href ? "a" : "div";

              return (
                <Wrapper
                  key={info.label}
                  href={info.href || undefined}
                  className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${info.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${info.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{info.label}</p>
                    <p className="font-semibold text-white">{info.value}</p>
                  </div>
                </Wrapper>
              );
            })}

            <div className="pt-4">
              <p className="mb-3 font-mono text-xs tracking-wide text-gray-500">
                {t.contact.social}
              </p>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-mono text-xs text-gray-400">
                {t.contact.name}
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-gray-400">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@domaine.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-gray-400">
                {t.contact.message}
              </label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.messagePlaceholder}
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-600 transition-colors focus:border-red-500 focus:outline-none"
              />
            </div>

            {submitMessage && (
              <p className="text-sm text-emerald-300">{submitMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3.5 font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {isSubmitting ? t.contact.sending : t.contact.send}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
