import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbarre from "./components/Navbarre";
import Footer from "./components/Footer";
import { LanguageProvider } from "./i18n/LanguageProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vessah - Développeur Full Stack & Designer",
    template: "%s | Vessah"
  },
  description: "Portfolio de Vessah, développeur Full Stack et Designer spécialisé en React, Next.js, ASP.NET Core et Design Graphique. Découvrez mes projets et compétences.",
  keywords: ["développeur", "full stack", "designer", "React", "Next.js", "ASP.NET", "portfolio", "web design", "Douala", "Vessah"],
  authors: [{ name: "Vessah" }],
  creator: "Vessah",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    title: "Vessah - Développeur Full Stack & Designer",
    description: "Portfolio de Vessah, développeur Full Stack et Designer spécialisé en React, Next.js, ASP.NET Core et Design Graphique.",
    siteName: "Portfolio Vessah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vessah - Développeur Full Stack & Designer",
    description: "Portfolio de Vessah, développeur Full Stack et Designer spécialisé en React, Next.js, ASP.NET Core et Design Graphique.",
    creator: "@vessah14",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Navbarre />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
