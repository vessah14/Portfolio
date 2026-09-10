export type Stat = {
  label: string;
  value: string;
  trend: string;
  tone: string;
};

export type RecentMessage = {
  name: string;
  subject: string;
  time: string;
  read: boolean;
};

export type Notification = {
  title: string;
  detail: string;
  time: string;
  type: "info" | "success" | "warning";
};

export const stats: Stat[] = [
  { label: "Visites", value: "24.8K", trend: "+12.5%", tone: "bg-cyan-500/15 text-cyan-300" },
  { label: "Messages reçus", value: "128", trend: "+18%", tone: "bg-emerald-500/15 text-emerald-300" },
  { label: "Projets", value: "18", trend: "+4", tone: "bg-violet-500/15 text-violet-300" },
  { label: "Compétences", value: "14", trend: "+2", tone: "bg-amber-500/15 text-amber-300" },
];

export const messageData = [18, 25, 22, 30, 35, 28, 40, 45, 38, 52, 48, 58];
export const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export const recentMessages: RecentMessage[] = [
  { name: "Sarah K.", subject: "Projet e-commerce", time: "Il y a 8 min", read: false },
  { name: "Nicolas T.", subject: "Besoin d'un portfolio", time: "Il y a 24 min", read: true },
  { name: "Amina B.", subject: "Refonte d'interface", time: "Il y a 1h", read: false },
  { name: "Yvan M.", subject: "Demande de collaboration", time: "Il y a 2h", read: true },
];

export const notifications: Notification[] = [
  { title: "Nouveau message reçu", detail: "3 messages non lus depuis aujourd'hui", time: "5 min", type: "info" },
  { title: "Projet ajouté", detail: "La landing page SaaS a été publiée", time: "1h", type: "success" },
  { title: "Mise à jour de compétences", detail: "2 nouvelles compétences ont été ajoutées", time: "2h", type: "warning" },
];

export const quickOverview = [
  { label: "Taux de conversion", value: "7.8%", color: "text-cyan-300" },
  { label: "Temps moyen", value: "3m 24s", color: "text-emerald-300" },
  { label: "Retour clients", value: "94%", color: "text-violet-300" },
];
