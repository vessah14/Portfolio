"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "fr" | "en";

const translations = {
  fr: {
    nav: { home: "Accueil", about: "À propos", projects: "Projets", contact: "Contact", cv: "Télécharger mon CV", switch: "Passer en anglais" },
    hero: { badge: "Étudiant en Génie Logiciel", hello: "Bonjour, je suis", description: "Développeur web passionné, designer UI/UX et créatif graphique. Je construis des solutions numériques modernes, performantes et esthétiques.", projects: "Voir mes projets", contact: "Me contacter", engineering: "Génie Logiciel" },
    about: { eyebrow: "01. À propos", title: "Développeur web", highlight: "Full Stack", first: "Bonjour et bienvenue ! Je suis Vessah Ndifon Ayatoulaye, développeur web Full Stack, diplômé d’un BTS en Génie Logiciel en 2026. Je crée des applications modernes avec React.js, Next.js, JavaScript, ASP.NET Core et les API REST, à travers mes stages et projets personnels.", second: "Mes projets incluent une application de gestion de parc automobile, une plateforme de réservation de billets de voyage et IMMO PILOT, un outil de gestion immobilière. Je recherche un stage ou un poste junior pour contribuer à des projets concrets et progresser. Mon objectif : transformer des idées en solutions numériques utiles et fiables. Contactez-moi pour parler d’une opportunité ou d’un projet.", completed: "Projets réalisés", creative: "Projets créatifs", skills: "Domaines de compétence", experience: "Années d'expérience", skillsEyebrow: "02. Compétences", skillsTitle: "Mes stacks & niveaux", skillsDescription: "Développement full-stack, design UI/UX et design graphique — trois domaines maîtrisés à différents niveaux." },
    contact: { eyebrow: "04. Contact", title: "Travaillons ensemble", description: "Un projet, une collaboration ou simplement un bonjour ? N'hésitez pas à me contacter.", social: "RETROUVEZ-MOI SUR :", name: "Votre nom", message: "Message", messagePlaceholder: "Décrivez votre projet ou votre demande...", sending: "Envoi...", send: "Envoyer le message", sent: "Message envoyé avec succès.", error: "Une erreur est survenue lors de l'envoi du message.", call: "Appeler" },
    projects: { title: "Mes réalisations", description: "Une sélection de projets en développement, design UI/UX et design graphique.", all: "Tous", noImage: "Aucune image disponible", noProjects: "Aucun projet enregistré pour le moment.", noSkills: "Aucune compétence enregistrée pour le moment.", viewImage: "Voir l'image de", viewSite: "Voir le site", viewDetail: "Voir le détail", viewDetails: "Voir les détails", downloadApk: "Télécharger l'APK", readMore: "Voir plus", readLess: "Voir moins", close: "Fermer la vue agrandie", other: "Autre" },
    levels: { Expert: "Expert", "Avancé": "Avancé", "Intermédiaire": "Intermédiaire" },
    footer: "VNAtech — Solutions · Innovation · Performance", rights: "Tous droits réservés.",
    access: { title: "Accès réservé à l’administration", description: "Les formulaires d’authentification ne sont disponibles que dans la partie admin." },
  },
  en: {
    nav: { home: "Home", about: "About", projects: "Projects", contact: "Contact", cv: "Download my CV", switch: "Switch to French" },
    hero: { badge: "Software Engineering Student", hello: "Hello, I am", description: "Passionate web developer, UI/UX designer and graphic creative. I build modern, high-performing and beautiful digital solutions.", projects: "View my projects", contact: "Contact me", engineering: "Software Engineering" },
    about: { eyebrow: "01. About", title: "Full Stack", highlight: "Web Developer", first: "Hello and welcome! I am Vessah Ndifon Ayatoulaye, a Full Stack web developer with a BTS in Software Engineering earned in 2026. I build modern applications with React.js, Next.js, JavaScript, ASP.NET Core and REST APIs through internships and personal projects.", second: "My projects include a fleet management app, a travel ticket booking platform and IMMO PILOT, a property management tool. I am seeking an internship or junior role where I can contribute to real projects and grow. My goal is to turn ideas into useful, reliable digital solutions. Contact me to discuss an opportunity or project.", completed: "Completed projects", creative: "Creative projects", skills: "Areas of expertise", experience: "Years of experience", skillsEyebrow: "02. Skills", skillsTitle: "My stacks & levels", skillsDescription: "Full-stack development, UI/UX design and graphic design — three areas mastered at different levels." },
    contact: { eyebrow: "04. Contact", title: "Let's work together", description: "A project, a collaboration, or simply hello? Feel free to get in touch.", social: "FIND ME ON:", name: "Your name", message: "Message", messagePlaceholder: "Describe your project or request...", sending: "Sending...", send: "Send message", sent: "Message sent successfully.", error: "An error occurred while sending your message.", call: "Call" },
    projects: { title: "My work", description: "A selection of development, UI/UX design and graphic design projects.", all: "All", noImage: "No image available", noProjects: "No project is registered yet.", noSkills: "No skill is registered yet.", viewImage: "View image of", viewSite: "View website", viewDetail: "View detail", viewDetails: "View details", downloadApk: "Download APK", readMore: "Read more", readLess: "Read less", close: "Close enlarged view", other: "Other" },
    levels: { Expert: "Expert", "Avancé": "Advanced", "Intermédiaire": "Intermediate" },
    footer: "VNAtech — Solutions · Innovation · Performance", rights: "All rights reserved.",
    access: { title: "Administration access only", description: "Authentication forms are only available in the admin application." },
  },
} as const;

type Translation = (typeof translations)[Language];
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: Translation };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("vnatech-language");
    if (savedLanguage === "en" || savedLanguage === "fr") {
      queueMicrotask(() => setLanguage(savedLanguage));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("vnatech-language", language);
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider.");
  return context;
}
