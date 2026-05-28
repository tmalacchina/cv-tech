"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

/**
 * Positions pré-calculées de 120 étoiles avec gradient de densité.
 *
 * La magie est dans la distribution verticale : au lieu d'un `seed * 65` uniforme,
 * on utilise `Math.pow(seed, 2.2) * 58`. Cette courbe de puissance écrase les valeurs
 * vers 0, ce qui concentre la majorité des étoiles dans le premier tiers du ciel et
 * laisse l'espace juste au-dessus du nuage presque vide. Résultat : un vrai effet
 * de profondeur, comme si on regardait vers le zénith.
 *
 * La taille et l'opacité suivent aussi le gradient : les étoiles plus basses
 * (donc statistiquement plus proches du sol) sont plus petites et plus pâles,
 * ce qui renforce la perspective.
 *
 * Math.sin est déterministe → pas de mismatch SSR/CSR, pas d'hydration warning.
 */
const STARS = Array.from({ length: 120 }, (_, i) => {
  const seed = (n: number) => {
    const x = Math.sin(n + 1) * 10000;
    return x - Math.floor(x);
  };
  // Arrondi à 3 décimales pour garantir la même string server/client
  // et éviter tout hydration mismatch dû aux normalisations de Framer Motion.
  const r = (n: number) => Number(n.toFixed(3));

  const verticalBias = Math.pow(seed(i * 2.3), 2.2);
  const topRaw = verticalBias * 58;
  const depthFade = 1 - verticalBias * 0.6;
  const sizeRaw = (seed(i * 3.7) * 1.6 + 0.4) * depthFade;
  const opacityRaw = (seed(i * 6.7) * 0.5 + 0.3) * depthFade;
  const leftRaw = seed(i * 1.1) * 100;

  // Chaînes CSS pré-formatées → zéro conversion float→string au render,
  // donc server et client produisent exactement le même HTML.
  return {
    left: `${r(leftRaw)}%`,
    top: `${r(topRaw)}%`,
    size: `${r(sizeRaw)}px`,
    boxShadow: `0 0 ${r(sizeRaw * 2)}px rgba(255,255,255,0.6)`,
    duration: r(seed(i * 4.1) * 3 + 2.5),
    delay: r(seed(i * 5.3) * 5),
    opacity: r(opacityRaw),
  };
});

/**
 * HeroSky — Section 1 (Ciel étoilé profond + Intro)
 * -----------------------------------------------------------------
 * Couches (z-index croissant) :
 *   0  — fond #0B1220 + dégradé haut
 *   1  — champ d'étoiles avec gradient de densité + parallax lent
 *   2  — étoiles filantes (traversent le haut)
 *   10 — photo (émerge du nuage)
 *   20 — nuage + éclairs internes
 *   30 — texte + scroll hint
 * -----------------------------------------------------------------
 */
export default function HeroSky() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);

  const cloudY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#0B1220" }}
    >
      {/* Dégradé subtil pour creuser la profondeur du ciel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
        style={{
          background:
            "linear-gradient(to bottom, #050914 0%, #0B1220 100%)",
        }}
      />

      {/* Champ d'étoiles — densité décroissante du haut vers le bas.
          Parallax léger au scroll pour un effet de profondeur cosmique. */}
      <motion.div
        aria-hidden
        style={{ y: starsY }}
        className="pointer-events-none absolute inset-0 z-[1] will-change-transform"
      >
        {STARS.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              boxShadow: star.boxShadow,
            }}
            animate={{
              opacity: [star.opacity, Number((star.opacity * 1.8).toFixed(3)), star.opacity],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Étoile filante 1 — diagonale descendante gauche → droite.
          Un wrapper rotated de -15deg + un motion.div qui animate x.
          La rotation du parent fait que le déplacement "x" se fait le long
          de la diagonale. Traînée via linear-gradient qui fade. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-[12%] z-[2] w-full overflow-visible"
        style={{ transform: "rotate(-12deg)" }}
      >
        <motion.div
          className="h-[1.5px] w-[110px] rounded-full"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,1) 100%)",
            boxShadow: "0 0 6px rgba(200,220,255,0.9)",
          }}
          initial={{ x: "-140px", opacity: 0 }}
          animate={{
            x: ["-140px", "calc(100vw + 140px)"],
            opacity: [0, 0, 1, 1, 0],
          }}
          transition={{
            duration: 1.8,
            times: [0, 0.05, 0.15, 0.9, 1],
            repeat: Infinity,
            repeatDelay: 9,
            ease: "linear",
          }}
        />
      </div>

      {/* Étoile filante 2 — diagonale descendante droite → gauche, plus rare. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-[6%] z-[2] w-full overflow-visible"
        style={{ transform: "rotate(12deg) scaleX(-1)" }}
      >
        <motion.div
          className="h-[1.5px] w-[90px] rounded-full"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,1) 100%)",
            boxShadow: "0 0 5px rgba(200,220,255,0.8)",
          }}
          initial={{ x: "-120px", opacity: 0 }}
          animate={{
            x: ["-120px", "calc(100vw + 120px)"],
            opacity: [0, 0, 1, 1, 0],
          }}
          transition={{
            duration: 2.2,
            times: [0, 0.05, 0.15, 0.9, 1],
            repeat: Infinity,
            repeatDelay: 14,
            delay: 4,
            ease: "linear",
          }}
        />
      </div>

      {/* Texte — haut gauche (nom, titre, baseline) */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute left-6 top-[5%] z-30 max-w-[90%] will-change-transform md:left-16 md:top-[18%] md:max-w-2xl lg:left-24"
      >
        <h1 className="text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
          Thomas
          <br />
          Malacchina
        </h1>

        <p className="mt-6 text-lg font-light tracking-wide text-slate-200 md:text-2xl lg:text-3xl">
          Software Engineer
          <br />
          <span className="text-base text-slate-300 md:text-lg lg:text-xl">Python · React · IA</span>
        </p>

        <div className="mt-8 max-w-md md:max-w-lg">
          <p className="text-base font-medium leading-relaxed text-white md:text-lg">
            Du script Python qui parle aux capteurs au dashboard React qui les rend lisibles : je code la chaîne complète, du repo vide au produit qui tourne en production.
          </p>
        </div>
      </motion.div>

      {/* Photo — haut droite, émerge du nuage */}
      <motion.div
        style={{ y: photoY, opacity: photoOpacity }}
        className="absolute bottom-[15%] right-0 z-10 h-[60%] w-[260px] will-change-transform md:h-[75%] md:right-8 md:w-[400px] lg:right-16 lg:w-[480px]"
      >
        <Image
          src="/profile.png"
          alt="Thomas Malacchina"
          fill
          priority
          sizes="(max-width: 768px) 260px, (max-width: 1024px) 400px, 480px"
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* Nuage — bande atmosphérique en bas avec éclairs internes. */}
      <motion.div
        style={{
          y: cloudY,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[32%] md:h-[38%] lg:h-[42%] will-change-transform"
      >
        <Image
          src="/cloud.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="select-none object-cover object-bottom"
        />

        {/* Éclair 1 */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 50% at 22% 65%, rgba(200, 220, 255, 0.95) 0%, rgba(150, 180, 255, 0.4) 25%, transparent 55%)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0, 0, 0, 1, 0.1, 0.85, 0, 0, 0] }}
          transition={{
            duration: 7,
            times: [0, 0.4, 0.5, 0.51, 0.53, 0.55, 0.58, 0.8, 1],
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Éclair 2 */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 35% 45% at 72% 55%, rgba(180, 210, 255, 0.8) 0%, rgba(130, 170, 255, 0.3) 30%, transparent 60%)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0, 0, 0, 0.9, 0, 0.4, 0, 0] }}
          transition={{
            duration: 11,
            times: [0, 0.6, 0.7, 0.71, 0.73, 0.75, 0.78, 1],
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Éclair 3 */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 80%, rgba(160, 200, 255, 0.5) 0%, transparent 50%)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0, 0, 0, 0.7, 0, 0] }}
          transition={{
            duration: 13,
            times: [0, 0.3, 0.32, 0.33, 0.35, 1],
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-slate-500"
      >
        Scroll ↓
      </motion.div>
    </section>
  );
}
