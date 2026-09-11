import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, Phone } from "lucide-react";

export type SkillLevel = "Expert" | "Avancé" | "Intermédiaire";

export type SkillItem = {
  name: string;
  level: SkillLevel;
  progress: number;
};

export type SkillCategory = {
  title: string;
  icon: string;
  skills: SkillItem[];
};

export type Project = {
  id: string | number;
  title: string;
  year: number | null;
  category: string;
  description: string;
  image?: string;
  lien?: string;
  tags: string[];
};

export type ContactInfo = {
  icon: LucideIcon;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  href: string | null;
};

export const levelStyles: Record<SkillLevel, string> = {
  Expert: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  Avancé: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
  Intermédiaire:
    "bg-amber-500/10 text-amber-400 border border-amber-500/30",
};

export const progressColors: Record<SkillLevel, string> = {
  Expert: "bg-gradient-to-r from-emerald-500 to-sky-500",
  Avancé: "bg-sky-500",
  Intermédiaire: "bg-amber-500",
};

export const contactInfos: ContactInfo[] = [
  {
    icon: Mail,
    label: "Email",
    value: "vessah14@gmail.com",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    href: null,
  },
  {
    icon: Phone,
    label: "Tel",
    value: "+237 6 73 05 42 60",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    href: null,
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Douala-Bonaberi",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    href: null,
  },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/vessah14" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ndifon-vessah-379aaa430/",
  },
];
