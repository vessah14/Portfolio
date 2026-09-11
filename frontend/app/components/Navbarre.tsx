"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageProvider";

const sectionIds = ["home", "about", "projects", "contact"];

export default function Navbarre() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hasScrolled, setHasScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const links = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.projects },
    { id: "contact", label: t.nav.contact },
  ];
  const switchLanguage = () => setLanguage(language === "fr" ? "en" : "fr");

  // Scroll state + scroll-spy
  useEffect(() => {
    const updateScrolledState = () => setHasScrolled(window.scrollY > 12);
    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      // Marge réduite : évite que les sections courtes ou petits écrans
      // ne déclenchent jamais l'état "actif"
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.05, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      observer.disconnect();
    };
  }, []);

  // Fermeture du menu mobile avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const linkClass = (id: string, mobile = false) =>
    `${mobile ? "text-left" : ""} text-sm transition-colors ${
      activeSection === id ? "text-red-400" : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav
      className={`sticky top-0 z-40 border-b p-4 transition-all duration-300 ${
        hasScrolled
          ? "border-gray-700/80 bg-black/90 shadow-lg shadow-black/30 backdrop-blur"
          : "border-gray-500 bg-black"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-3">
        <Link href="/#home" className="text-2xl font-bold text-white" aria-label="Accueil">
          VNA<span className="text-red-500 italic">tech</span>
        </Link>

        <div className="hidden space-x-4 md:flex">
          {links.map((link) => (
            <a key={link.id} href={`/#${link.id}`} className={linkClass(link.id)}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Bouton langue : uniquement en desktop, la version mobile est dans le menu déroulant */}
          <button
            type="button"
            onClick={switchLanguage}
            aria-label={t.nav.switch}
            className="hidden rounded-full border border-gray-600 px-3 py-2 text-sm font-medium text-gray-200 transition hover:border-red-400 hover:text-white md:block"
          >
            {language === "fr" ? "EN" : "FR"}
          </button>

          <a
            href="/cv-vna-tech.pdf"
            download
            className="hidden cursor-pointer rounded-full bg-red-500 px-3 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:translate-y-[-2px] hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-400 sm:inline-block"
          >
            {t.nav.cv}
          </a>

          <button
            className="text-white md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col space-y-3 px-2 md:hidden">
          {links.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={() => setIsOpen(false)}
              className={linkClass(link.id, true)}
            >
              {link.label}
            </a>
          ))}
          <button type="button" onClick={switchLanguage} className="text-left text-sm text-gray-300">
            {language === "fr" ? "English" : "Français"}
          </button>
          <a
            href="/cv-vna-tech.pdf"
            download
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-red-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-600"
          >
            {t.nav.cv}
          </a>
        </div>
      )}
    </nav>
  );
}