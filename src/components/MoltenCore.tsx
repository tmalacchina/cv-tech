"use client";

import { motion } from "framer-motion";

/* =================================================================
 * Données — coordonnées de contact (extraites du CV)
 * ================================================================= */

const LINKEDIN_URL = "https://www.linkedin.com/in/thomas-malacchina-8603bb16b/";
const EMAIL = "thomas.malacchina@outlook.com";
const PHONE_DISPLAY = "07 82 35 42 05";
const PHONE_TEL = "+33782354205";

const CONTACTS = [
  {
    id: "email",
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Téléphone",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "Thomas Malacchina",
    href: LINKEDIN_URL,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
];

/* =================================================================
 * Génération déterministe — seed via sin/cos
 * ================================================================= */

const seed = (n: number) => {
  const x = Math.sin(n * 19.3 + 7.7) * 10000;
  return x - Math.floor(x);
};
const r = (n: number) => Number(n.toFixed(3));

/* Bulles de lave — montent depuis le sol, gonflent, éclatent */
const BUBBLES = Array.from({ length: 12 }, (_, i) => {
  const sizeRaw = 18 + seed(i * 1.7) * 32; // 18-50 px
  const durationRaw = 7 + seed(i * 2.3) * 8; // 7-15 s
  const delayRaw = -seed(i * 3.1) * 14;
  return {
    left: `${r(seed(i * 5.3) * 100)}%`,
    size: r(sizeRaw),
    duration: r(durationRaw),
    delay: r(delayRaw),
  };
});

/* Braises — petits points qui montent en linéaire avec drift latéral */
const EMBERS = Array.from({ length: 30 }, (_, i) => {
  const sizeRaw = 1.2 + seed(i * 1.3) * 2.5; // 1.2-3.7 px
  const durationRaw = 5 + seed(i * 2.7) * 7; // 5-12 s
  const delayRaw = -seed(i * 4.1) * 10;
  const drift = (seed(i * 6.7) - 0.5) * 80; // -40 à +40 px
  return {
    left: `${r(seed(i * 7.9) * 100)}%`,
    size: r(sizeRaw),
    duration: r(durationRaw),
    delay: r(delayRaw),
    drift: r(drift),
    glow: r(sizeRaw * 2.5),
  };
});

/* Fissures lumineuses au sol — paths SVG qui pulsent */
const CRACKS = [
  "M 0 60 L 80 50 L 140 65 L 200 45 L 270 60",
  "M 320 55 L 380 70 L 450 50 L 510 65 L 580 55",
  "M 620 65 L 690 50 L 750 70 L 820 55 L 890 65",
  "M 940 50 L 1010 65 L 1070 55 L 1140 70 L 1200 60",
  "M 100 90 L 170 100 L 240 85 L 310 95",
  "M 850 100 L 920 90 L 990 105 L 1060 92",
];

/* =================================================================
 * MoltenCore (Section 4) — Noyau en fusion + Contact
 * =================================================================
 * Couches (z-index croissant) :
 *   0   — fond gradient noir → rouge → lave
 *   1   — noyau pulsant (radial gradient central)
 *   2   — bulles de lave + fissures au sol
 *   3   — braises qui montent
 *   10  — contenu (titre + CTA + boutons)
 * ================================================================= */

export default function MoltenCore() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        // Du noir des racines (top) vers la lave brûlante (bottom)
        background:
          "linear-gradient(to bottom, #000000 0%, #1A0500 18%, #4A0A00 45%, #8B1A00 72%, #C43D00 90%, #FF5A1A 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Noyau pulsant — radial gradient central qui respire */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "1400px",
          height: "1400px",
          background:
            "radial-gradient(circle, rgba(255, 100, 30, 0.35) 0%, rgba(255, 60, 0, 0.18) 30%, rgba(140, 20, 0, 0.08) 55%, transparent 75%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Halo doré autour du noyau (chaleur intense) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(255, 200, 80, 0.25) 0%, rgba(255, 130, 30, 0.1) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bulles de lave — z-[2], montent depuis le sol */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {BUBBLES.map((bubble, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              background:
                "radial-gradient(circle, rgba(255, 220, 100, 0.95) 0%, rgba(255, 130, 30, 0.85) 35%, rgba(200, 50, 0, 0.6) 70%, transparent 100%)",
              boxShadow:
                "0 0 30px rgba(255, 130, 30, 0.6), 0 0 60px rgba(255, 80, 0, 0.3)",
            }}
            initial={{ top: "110%", scale: 0, opacity: 0 }}
            animate={{
              top: ["110%", "60%", "25%", "20%"],
              scale: [0, 0.8, 1.3, 0],
              opacity: [0, 0.9, 0.95, 0],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeOut",
              times: [0, 0.4, 0.85, 1],
            }}
          />
        ))}
      </div>

      {/* Fissures lumineuses au sol — pulsent en intensité */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[140px]"
      >
        <svg
          viewBox="0 0 1200 140"
          preserveAspectRatio="xMidYEnd slice"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <filter id="crack-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {CRACKS.map((d, i) => (
            <motion.path
              key={`crack-${i}`}
              d={d}
              stroke="rgba(255, 220, 130, 0.95)"
              strokeWidth={2.2}
              strokeLinecap="round"
              fill="none"
              filter="url(#crack-glow)"
              animate={{
                opacity: [0.4, 0.95, 0.4],
              }}
              transition={{
                duration: 2.5 + (i % 3) * 0.7,
                delay: (i % 4) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Braises — z-[3], par-dessus les bulles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        {EMBERS.map((ember, i) => (
          <motion.div
            key={`ember-${i}`}
            className="absolute rounded-full"
            style={{
              left: ember.left,
              width: ember.size,
              height: ember.size,
              background: "rgba(255, 200, 100, 1)",
              boxShadow: `0 0 ${ember.glow}px rgba(255, 150, 50, 0.95)`,
            }}
            initial={{ top: "100%", x: 0, opacity: 0 }}
            animate={{
              top: ["100%", "-5%"],
              x: [0, ember.drift, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              top: {
                duration: ember.duration,
                delay: ember.delay,
                repeat: Infinity,
                ease: "linear",
              },
              x: {
                duration: ember.duration,
                delay: ember.delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: ember.duration,
                delay: ember.delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.85, 1],
              },
            }}
          />
        ))}
      </div>

      {/* Contenu — z-[10] */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-32 text-center md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-xs uppercase tracking-[0.4em] text-amber-200/80 md:text-sm"
        >
          Disponible — mission Enterprise
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mt-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          style={{
            textShadow: "0 0 40px rgba(255, 150, 50, 0.4)",
          }}
        >
          Du PoC à la
          <br />
          <span
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #FFE5A0 0%, #FF9020 60%, #FF4500 100%)",
            }}
          >
            production.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-amber-50/90 md:text-lg"
        >
          Vous concevez un outil de remontée de données capteurs, un dashboard de supervision industriel ou un PoC à industrialiser. Je développe et livre — Python pour la chaîne data, React pour l'interface, méthode courte de la spec à la mise en service.
        </motion.p>

        {/* Boutons CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:mt-16 md:gap-4"
        >
          {CONTACTS.map((contact) => (
            <a
              key={contact.id}
              href={contact.href}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noopener noreferrer" : undefined}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-amber-300/40 bg-black/40 px-6 py-4 text-sm font-medium text-amber-50 backdrop-blur-md transition-all duration-300 hover:border-amber-200/80 hover:bg-amber-500/10 md:text-base"
              style={{
                boxShadow:
                  "0 0 20px rgba(255, 130, 30, 0.15), inset 0 1px 0 rgba(255, 220, 150, 0.1)",
              }}
            >
              {/* Halo qui s'allume au hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 100%, rgba(255, 150, 30, 0.4) 0%, transparent 70%)",
                  boxShadow: "0 0 40px rgba(255, 150, 30, 0.6)",
                }}
              />
              <span className="relative text-amber-300 transition-colors duration-300 group-hover:text-amber-100">
                {contact.icon}
              </span>
              <span className="relative flex flex-col items-start leading-tight sm:items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-200/60 group-hover:text-amber-100/80">
                  {contact.label}
                </span>
                <span className="text-sm font-medium md:text-base">
                  {contact.value}
                </span>
              </span>
            </a>
          ))}
        </motion.div>

        {/* Signature — bas du footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 text-[11px] uppercase tracking-[0.3em] text-amber-200/40 md:mt-28"
        >
          Vienne, Isère · disponible pour mission Enterprise
        </motion.p>
      </div>
    </section>
  );
}
