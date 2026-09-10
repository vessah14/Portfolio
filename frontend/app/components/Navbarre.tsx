"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function Navbarre() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const links = [{ href: "/", label: t.nav.home }, { href: "/about", label: t.nav.about }, { href: "/Projects", label: t.nav.projects }, { href: "/contact", label: t.nav.contact }];
  const switchLanguage = () => setLanguage(language === "fr" ? "en" : "fr");

  return <nav className="bg-black border-b border-gray-500 p-4"><div className="container mx-auto flex items-center justify-around gap-3"><div className="text-white font-bold text-2xl">VNA<span className="text-red-500 italic">tech</span></div><div className="space-x-4 hidden md:flex">{links.map((link) => <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white font-normal text-sm">{link.label}</Link>)}</div><button type="button" onClick={switchLanguage} aria-label={t.nav.switch} className="rounded-full border border-gray-600 px-3 py-2 text-sm font-medium text-gray-200 transition hover:border-red-400 hover:text-white">{language === "fr" ? "EN" : "FR"}</button><Link href="/cv" className="hidden sm:inline-block hover:text-white text-sm bg-red-500 hover:bg-red-600 cursor-pointer hover:shadow-lg hover:shadow-red-400 hover:translate-y-[-2px] ease-in-out duration-300 text-white py-2 px-3 rounded-full font-medium">{t.nav.cv}</Link><button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">{isOpen ? <X size={24} /> : <Menu size={24} />}</button></div>{isOpen && <div className="md:hidden mt-4 flex flex-col space-y-3 px-2">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white text-sm">{link.label}</Link>)}<button type="button" onClick={switchLanguage} className="text-left text-sm text-gray-300">{language === "fr" ? "English" : "Français"}</button><Link href="/cv" className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-full font-medium text-center">{t.nav.cv}</Link></div>}</nav>;
}
