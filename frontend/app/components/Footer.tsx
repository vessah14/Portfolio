"use client";
import { useLanguage } from "../i18n/LanguageProvider";
export default function Footer() { const year = new Date().getFullYear(); const { t } = useLanguage(); return <footer className="bg-gray-950 border-t border-gray-800 px-6 py-4"><div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"><span className="text-gray-400 text-sm">{t.footer}</span><span className="text-gray-500 text-sm">© {year} VNAtech. {t.rights}</span></div></footer>; }
