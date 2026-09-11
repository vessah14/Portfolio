"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../i18n/LanguageProvider";
import { motion } from "motion/react";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section id="home" className="bg-black text-white py-20 scroll-mt-20">
      <div className="max-w-[1100px] mx-auto px-4 border-b py-10 border-gray-500 flex flex-col lg:flex-row items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col  justify-center lg:gap-2 "
        >
          <div className="mb-6 bg-black/40 border border-red-500/40 gap-2 inline-flex items-center justify-center rounded-full px-4 py-1.5 w-fit shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            <span className="text-[11px] font-light text-red-400">
              {t.hero.badge}
            </span>
          </div>
          <h2 className="text-sm lg:text-xl text-gray-500 ">{t.hero.hello}</h2>
          <h1 className="text-2xl md:text-6xl font-extrabold flex flex-col gap-1 lg:gap-6">
            Vessahndifon <span className="text-red-500">Ayatoulaye</span>
          </h1>
          <p className="text-gray-300 mt-4 max-w-lg">{t.hero.description}</p>

          <div className="flex gap-4">
            <Link
              href="/contact"
              className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 text-white font-semibold py-2 px-4 rounded-full mt-6 inline-block transition duration-300 ease-in-out transform hover:scale-105"
            >
              {t.hero.projects}
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 border-2 border-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full mt-6 inline-block transition duration-300 ease-in-out transform hover:scale-105"
            >
              {t.hero.contact}
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Photo engineering={t.hero.engineering} />
        </motion.div>
      </div>
    </section>
  );
}
function Photo({ engineering }: { engineering: string }) {
  return (
    <div className="relative flex justify-center items-center mt-8">
      {/* Cercle avec bordure dégradée */}
      <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }} className="relative w-40 h-40 md:w-60 md:h-60 rounded-full p-[3px] bg-gradient-to-b from-red-500 via-red-500/50 to-transparent shadow-lg shadow-red-500/30">
        <div
          className="w-full h-full rounded-full overflow-hidden bg-black"
        >
          <Image
            src="/photo.png"
            alt="Photo de profil"
            width={240}
            height={240}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Badge "Design" - haut droite */}
      <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }} className="absolute top-2 -right-15 md:top-6  flex items-center gap-1.5 bg-gray-900 border border-gray-700 rounded-full px-3 py-1.5 shadow-md">
        <span>🎨</span>
        <span className="text-white text-xs font-medium">Design</span>
      </motion.div>

      {/* Badge "Génie Logiciel" - bas gauche */}
      <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }} className="absolute bottom-4 -left-20 md:bottom-8  flex items-center gap-1.5 bg-gray-900 border border-gray-700 rounded-full px-3 py-1.5 shadow-md">
        <span>💻</span>
        <span className="text-red-400 text-xs font-medium">{engineering}</span>
      </motion.div>
    </div>
  );
}
