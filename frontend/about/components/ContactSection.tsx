"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "lucide-react";

import { contactInfos, socials } from "@/data/about";
import { useLanguage } from "@/app/i18n/LanguageProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-1-ypt3.onrender.com/api";

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
      const response = await fetch(`${API_BASE_URL}/Message`, {
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

      if (!response.ok) {
        throw new Error("Votre message n'a pas pu être envoyé.");
      }

      setSubmitMessage(t.contact.sent);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitMessage(t.contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-6 py-20 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-red-500" />
            <span className="text-red-500 text-sm font-mono">{t.contact.eyebrow}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-gray-400">
            {t.contact.description}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {contactInfos.map((info) => {
              const Icon = info.icon;
              const Wrapper = info.href ? "a" : "div";

              return (
                <Wrapper
                  key={info.label}
                  href={info.href || undefined}
                  className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors"
                >
                  <div
                    className={`w-11 h-11 flex items-center justify-center rounded-xl ${info.iconBg}`}
                  >
                    <Icon className={`w-5 h-5 ${info.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">{info.label}</p>
                    <p className="text-white font-semibold">{info.value}</p>
                  </div>
                </Wrapper>
              );
            })}

            <div className="pt-4">
              <p className="text-gray-500 text-xs font-mono tracking-wide mb-3">
                {t.contact.social}
              </p>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-mono mb-2">
                {t.contact.name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-mono mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@exemple.com"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-mono mb-2">
                {t.contact.message}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.messagePlaceholder}
                rows={5}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
              />
            </div>

            {submitMessage && (
              <p className="text-sm text-emerald-300">{submitMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-400 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              {isSubmitting ? t.contact.sending : t.contact.send}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
