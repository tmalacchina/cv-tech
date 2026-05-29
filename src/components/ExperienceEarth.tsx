"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * 50 flocons pré-calculés — positions, tailles, vitesses déterministes.
 */
const SNOWFLAKES = Array.from({ length: 50 }, (_, i) => {
  const seed = (n: number) => {
    const x = Math.sin(n * 13.7 + 1.3) * 10000;
    return x - Math.floor(x);
  };
  const r = (n: number) => Number(n.toFixed(3));

  const sizeRaw = seed(i * 1.3) * 2.2 + 0.8;
  const durationRaw = seed(i * 2.7) * 10 + 12;
  const opacityRaw = seed(i * 4.1) * 0.5 + 0.4;

  return {
    left: `${r(seed(i * 5.3) * 100)}%`,
    size: `${r(sizeRaw)}px`,
    glow: `${r(sizeRaw * 1.8)}px`,
    duration: r(durationRaw),
    delay: r(-seed(i * 7.9) * durationRaw),
    opacity: r(opacityRaw),
  };
});

const SNOW_PATHS = [
  "M0,0 L400,0 L400,9 Q340,13 280,7 T160,11 T0,9 Z",
  "M0,0 L400,0 L400,10 Q320,14 240,9 T120,12 T0,10 Z",
  "M0,0 L400,0 L400,8 Q360,12 300,7 T180,10 T0,9 Z",
];

const EXPERIENCES = [
  {
    id: "dev-web-automation",
    title: "Développeur Freelance — Web & Automation",
    subtitle: "Missions clients",
    period: "2025 → présent",
    side: "left" as const,
    bullets: [
      {
        label: "Horizon Forms",
        text: "Développement d'un SaaS web en Next.js / TypeScript / Python. Templating de rapports, intégration d'APIs externes (dont OpenAI et Anthropic), optimisation de perf et déploiement.",
      },
      {
        label: "Workflows d'automatisation",
        text: "Conception et code de workflows en n8n + scripts Python d'orchestration. Intégration d'APIs tierces (services métier, LLMs), logs structurés et fallback.",
      },
      {
        label: "Planet Line",
        text: "Scripts Python d'automatisation pour une PME industrielle : génération de devis depuis CRM, relances email asynchrones, ETL fichiers comptables.",
      },
      {
        label: "Portfolio dynamique (ce site)",
        text: "Application Next.js 14 + TypeScript + Tailwind + Framer Motion. Animations parallax scroll, déploiement CI/CD via Vercel, repo public sur GitHub.",
      },
    ],
  },
  {
    id: "freelance-crm-backend",
    title: "Développeur Freelance — CRM & Backend",
    subtitle: "Mirtech & Loroverde",
    period: "2024 – 2025",
    side: "right" as const,
    bullets: [
      {
        label: "Mirtech — CRM custom",
        text: "Développement d'un CRM en Python : parser email (IMAP), transcription audio, traitement via API tierce, persistence base de données.",
      },
      {
        label: "Loroverde — Backend",
        text: "Architecture et code des APIs REST en Python. Intégrations Make / Zapier pour automatisations métier, déploiement cloud.",
      },
      {
        label: "Stack",
        text: "Python, PostgreSQL, Git, APIs REST, Make, Zapier, OpenAI API.",
      },
    ],
  },
  {
    id: "hedon-industriel",
    title: "Référent Comptes Industriels",
    subtitle: "Hedon Technologies",
    period: "2023 – 2024",
    side: "left" as const,
    bullets: [
      {
        label: "Environnements techniques exigeants",
        text: "Immersion sur des comptes industriels critiques : nucléaire, automobile, télécom, défense. Acquisition d'une culture technique sectorielle solide — utile pour comprendre les contraintes d'un projet industriel.",
      },
      {
        label: "Cadrage de besoin",
        text: "Dialogue avec directions techniques et architectes système. Traduction des besoins métier en spécifications techniques exploitables par les équipes dev.",
      },
    ],
  },
];

/**
 * Gradients — cross-fadés via opacity.
 */
const WINTER_BG =
  "linear-gradient(to bottom, #0B1220 0%, #1C2840 22%, #2F3F5E 50%, #445674 78%, #566A88 100%)";
const SUMMER_BG =
  "linear-gradient(to bottom, #0B1220 0%, #1E3A5F 15%, #4A89C8 40%, #7AB8E0 70%, #B0DDF0 100%)";

/* -----------------------------------------------------------------
 * SKYLINE — données + helpers
 * -----------------------------------------------------------------
 * ViewBox 1600 x 280, le sol est à y=280. Les bâtiments montent
 * depuis le sol (y = 280 - h). Génération déterministe des
 * fenêtres allumées via seed sin/cos pour éviter mismatch SSR/CSR.
 * ----------------------------------------------------------------- */

const CITY_VIEWBOX_W = 1600;
const CITY_VIEWBOX_H = 280;
const CITY_GROUND_Y = CITY_VIEWBOX_H;

type BuildingType = "flat" | "pointy" | "antenna" | "stepped";

const BUILDING_SPECS: { x: number; w: number; h: number; type: BuildingType }[] = [
  { x: 0,    w: 80,  h: 110, type: "flat" },
  { x: 85,   w: 50,  h: 165, type: "flat" },
  { x: 140,  w: 100, h: 130, type: "flat" },
  { x: 245,  w: 35,  h: 220, type: "antenna" },
  { x: 285,  w: 90,  h: 175, type: "pointy" },
  { x: 380,  w: 70,  h: 145, type: "flat" },
  { x: 455,  w: 110, h: 200, type: "flat" },
  { x: 570,  w: 60,  h: 180, type: "flat" },
  { x: 635,  w: 60,  h: 180, type: "flat" },
  { x: 700,  w: 130, h: 230, type: "stepped" },
  { x: 835,  w: 80,  h: 155, type: "flat" },
  { x: 920,  w: 100, h: 195, type: "pointy" },
  { x: 1025, w: 65,  h: 140, type: "flat" },
  { x: 1095, w: 90,  h: 175, type: "flat" },
  { x: 1190, w: 45,  h: 240, type: "antenna" },
  { x: 1240, w: 110, h: 165, type: "flat" },
  { x: 1355, w: 75,  h: 130, type: "flat" },
  { x: 1435, w: 95,  h: 195, type: "pointy" },
  { x: 1535, w: 65,  h: 145, type: "flat" },
];

const citySeed = (n: number) => {
  const x = Math.sin(n * 17.3 + 5.7) * 10000;
  return x - Math.floor(x);
};

type Building = (typeof BUILDING_SPECS)[number] & {
  cols: number;
  rows: number;
  lit: boolean[];
};

const CITY_BUILDINGS: Building[] = BUILDING_SPECS.map((b, i) => {
  const cols = Math.max(1, Math.floor(b.w / 14));
  const rows = Math.max(2, Math.floor(b.h / 16));
  const total = rows * cols;
  // ~58% de fenêtres allumées en hiver, mix déterministe.
  const lit = Array.from({ length: total }, (_, j) => citySeed(i * 100 + j) > 0.42);
  return { ...b, cols, rows, lit };
});

/**
 * Rendu d'un bâtiment dans une couche (winter|summer).
 * En "winter" : silhouette quasi-noire, fenêtres jaunes chaudes,
 * snow caps sur les toits.
 * En "summer" : silhouette plus claire (reflète le ciel bleu),
 * fenêtres bleu-clair tamisées, pas de neige.
 */
function CityBuilding({
  building,
  mode,
}: {
  building: Building;
  mode: "winter" | "summer";
}) {
  const { x, w, h, type, cols, rows, lit } = building;
  const y = CITY_GROUND_Y - h;

  const bodyFill = mode === "winter" ? "#050810" : "#1F3247";
  const litFill =
    mode === "winter" ? "rgba(255, 215, 130, 0.88)" : "rgba(180, 220, 240, 0.32)";
  const unlitFill =
    mode === "winter" ? "rgba(20, 25, 35, 0.6)" : "rgba(40, 60, 80, 0.5)";
  const snowFill = "rgba(245, 250, 255, 0.92)";

  const winPad = 3;
  const winW = (w - winPad * (cols + 1)) / cols;
  const winH = (h - winPad * (rows + 1)) / rows;

  return (
    <g>
      {/* Corps */}
      {type === "flat" && (
        <rect x={x} y={y} width={w} height={h} fill={bodyFill} />
      )}
      {type === "pointy" && (
        <>
          <rect x={x} y={y} width={w} height={h} fill={bodyFill} />
          <polygon
            points={`${x},${y} ${x + w / 2},${y - 32} ${x + w},${y}`}
            fill={bodyFill}
          />
        </>
      )}
      {type === "antenna" && (
        <>
          <rect x={x} y={y} width={w} height={h} fill={bodyFill} />
          <line
            x1={x + w / 2}
            y1={y}
            x2={x + w / 2}
            y2={y - 28}
            stroke={bodyFill}
            strokeWidth="2"
          />
          <circle
            cx={x + w / 2}
            cy={y - 30}
            r="2.5"
            fill={mode === "winter" ? "rgba(255, 90, 90, 0.95)" : "rgba(255, 90, 90, 0.4)"}
          />
        </>
      )}
      {type === "stepped" && (
        <>
          <rect x={x} y={y} width={w} height={h} fill={bodyFill} />
          <rect x={x + 18} y={y - 28} width={w - 36} height={28} fill={bodyFill} />
          <rect x={x + 38} y={y - 56} width={w - 76} height={28} fill={bodyFill} />
        </>
      )}

      {/* Snow cap (hiver uniquement) */}
      {mode === "winter" && type === "flat" && (
        <rect x={x} y={y - 3} width={w} height={3} fill={snowFill} />
      )}
      {mode === "winter" && type === "antenna" && (
        <rect x={x} y={y - 2} width={w} height={2} fill={snowFill} />
      )}
      {mode === "winter" && type === "stepped" && (
        <>
          <rect x={x} y={y - 2} width={w} height={2} fill={snowFill} />
          <rect x={x + 18} y={y - 30} width={w - 36} height={2} fill={snowFill} />
          <rect x={x + 38} y={y - 58} width={w - 76} height={2} fill={snowFill} />
        </>
      )}
      {mode === "winter" && type === "pointy" && (
        <polygon
          points={`${x + w / 2 - 12},${y - 16} ${x + w / 2},${y - 32} ${x + w / 2 + 12},${y - 16}`}
          fill={snowFill}
        />
      )}

      {/* Fenêtres */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = r * cols + c;
          const wx = x + winPad + c * (winW + winPad);
          const wy = y + winPad + r * (winH + winPad);
          const isLit = lit[idx];
          return (
            <rect
              key={`${r}-${c}`}
              x={wx}
              y={wy}
              width={winW}
              height={winH}
              fill={isLit ? litFill : unlitFill}
            />
          );
        })
      )}
    </g>
  );
}

/**
 * ExperienceEarth (Section 2) — Ciel enneigé/ensoleillé + Parcours + Skyline
 * --------------------------------------------------------------------------
 * Couches (z-index croissant) :
 *   0   — fonds hiver + été (cross-fade opacity)
 *   1   — soleil + rayon diagonal (sous les nuages)
 *   2   — bande nuageuse + voile diffuseur sur le soleil
 *   3   — skyline (deux couches cross-fadées)
 *   10  — en-tête et cartes
 *   20  — flocons qui tombent
 * --------------------------------------------------------------------------
 */
export default function ExperienceEarth() {
  const [isSummer, setIsSummer] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0B1220" }}
    >
      {/* Fond HIVER */}
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: WINTER_BG }} />

      {/* Fond ÉTÉ — overlay cross-fade */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: SUMMER_BG }}
        animate={{ opacity: isSummer ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />

      {/* Soleil — z-[1], DERRIÈRE les nuages. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[4%] top-[5%] z-[1] h-[180px] w-[180px] rounded-full md:right-[5%] md:top-[7%] md:h-[260px] md:w-[260px] lg:h-[300px] lg:w-[300px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,248,220,0.98) 0%, rgba(255,235,175,0.7) 28%, rgba(255,215,135,0.3) 52%, rgba(255,200,110,0.1) 70%, transparent 82%)",
          filter: "blur(1px)",
        }}
        animate={{
          opacity: isSummer ? 1 : 0,
          scale: isSummer ? [1, 1.04, 1] : 1,
        }}
        transition={{
          opacity: { duration: 0.9, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Rayon de soleil */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(255,235,190,0.1) 8%, rgba(255,245,210,0.24) 22%, rgba(255,245,210,0.2) 30%, rgba(255,235,190,0.1) 45%, transparent 60%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: isSummer ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />

      {/* Bande nuageuse */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[28%] md:h-[32%] lg:h-[36%]"
        style={{
          transform: "scaleY(-1)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 75%, black 100%)",
        }}
        animate={{ opacity: isSummer ? 0.75 : 0.88 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        <Image
          src="/cloud.png"
          alt=""
          fill
          sizes="100vw"
          className="select-none object-cover object-bottom"
        />
      </motion.div>

      {/* Diffuseur nuageux sur le soleil */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] top-[-2%] z-[2] h-[280px] w-[360px] md:right-[-3%] md:top-[0%] md:h-[400px] md:w-[520px] lg:h-[460px] lg:w-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 48% at 55% 55%, rgba(175,195,220,0.55) 0%, rgba(175,195,220,0.3) 40%, transparent 75%)",
          filter: "blur(16px)",
        }}
        animate={{ opacity: isSummer ? 0.75 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />

      {/* En-tête de section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-28 text-center md:px-12 md:pt-40 lg:pt-48"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Parcours</p>
        <h2 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Trois chapitres,
          <br />
          une ligne droite.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-slate-300 md:text-lg">
          Du placement d'ingénieurs industriels au déploiement d'agents IA :
          la même méthode, des outils de plus en plus puissants.
        </p>
      </motion.div>

      {/* Cartes — padding bas augmenté pour respirer au-dessus des toits */}
      <div className="relative z-10 mx-auto mt-48 flex max-w-6xl flex-col gap-20 px-6 pb-12 md:mt-56 md:gap-28 md:px-12 md:pb-16 lg:mt-64 lg:pb-20">
        {EXPERIENCES.map((exp, i) => {
          const isFirst = i === 0;

          const wrapperClass = isFirst
            ? "flex w-full flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-10"
            : `flex w-full md:w-[82%] lg:w-[68%] ${
                exp.side === "right" ? "md:ml-auto" : ""
              }`;

          const cardClass = isFirst
            ? "relative w-full rounded-2xl border border-white/10 p-8 backdrop-blur-md md:p-10 lg:w-[68%]"
            : "relative w-full rounded-2xl border border-white/10 p-8 backdrop-blur-md md:p-10";

          return (
            <motion.article
              key={exp.id}
              initial={{
                opacity: 0,
                x: exp.side === "left" ? -60 : 60,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={wrapperClass}
            >
              <div
                className={cardClass}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                {/* Neige accumulée — fade out en mode été */}
                <motion.svg
                  aria-hidden
                  className="pointer-events-none absolute -top-[11px] left-0 w-full"
                  viewBox="0 0 400 18"
                  preserveAspectRatio="none"
                  style={{ height: "18px" }}
                  animate={{ opacity: isSummer ? 0 : 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <path
                    d={SNOW_PATHS[i % 3]}
                    fill="rgba(200, 220, 240, 0.35)"
                    transform="translate(0, 3)"
                  />
                  <path d={SNOW_PATHS[i % 3]} fill="rgba(255, 255, 255, 0.95)" />
                </motion.svg>

                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 md:text-xs">
                    {exp.period}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 md:text-xs">
                    {exp.subtitle}
                  </p>
                </div>

                <h3 className="mt-4 text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                  {exp.title}
                </h3>

                <ul className="mt-8 space-y-5">
                  {exp.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="text-sm leading-relaxed text-slate-200 md:text-base"
                    >
                      <span className="font-semibold text-white">
                        {bullet.label}
                      </span>
                      <span className="text-slate-300"> — {bullet.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Panneau annexe Mode Été/Hiver — sort de la carte 1 */}
              {isFirst && (
                <div className="flex w-full flex-col items-start gap-3 lg:flex-1 lg:items-start lg:pl-2">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300 md:text-xs">
                    Choisis ta saison ↓
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSummer((s) => !s)}
                    aria-pressed={isSummer}
                    aria-label={
                      isSummer ? "Revenir au mode hiver" : "Passer en mode été"
                    }
                    className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] backdrop-blur-md transition hover:border-white/40 hover:bg-white/20"
                  >
                    <span
                      aria-hidden
                      className="text-sm transition-transform group-hover:scale-110"
                    >
                      {isSummer ? "❄" : "☀"}
                    </span>
                    <span>{isSummer ? "Mode Hiver" : "Mode Été"}</span>
                  </button>
                  <p className="text-[10px] leading-relaxed text-slate-400 md:text-[11px]">
                    {isSummer
                      ? "Retour au ciel étoilé et à la neige."
                      : "Bascule le ciel en bleu ensoleillé."}
                  </p>
                </div>
              )}
            </motion.article>
          );
        })}
      </div>

      {/* SKYLINE — z-[3], en flow normal pour rester collée au contenu */}
      <div
        aria-hidden
        className="pointer-events-none relative z-[3] w-full h-[180px] md:h-[240px] lg:h-[280px]"
        style={{ marginBottom: -1 }}
      >
        {/* Couche HIVER (toujours visible, base) */}
        <svg
          viewBox={`0 0 ${CITY_VIEWBOX_W} ${CITY_VIEWBOX_H}`}
          preserveAspectRatio="xMidYEnd slice"
          className="absolute inset-0 h-full w-full"
        >
          {CITY_BUILDINGS.map((b, i) => (
            <CityBuilding key={`w-${i}`} building={b} mode="winter" />
          ))}
        </svg>

        {/* Couche ÉTÉ — overlay cross-fade */}
        <motion.svg
          viewBox={`0 0 ${CITY_VIEWBOX_W} ${CITY_VIEWBOX_H}`}
          preserveAspectRatio="xMidYEnd slice"
          className="absolute inset-0 h-full w-full"
          animate={{ opacity: isSummer ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {CITY_BUILDINGS.map((b, i) => (
            <CityBuilding key={`s-${i}`} building={b} mode="summer" />
          ))}
        </motion.svg>

        {/* Halo lumineux au-dessus des toits en hiver (pollution lumineuse douce) */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background:
              "linear-gradient(to top, rgba(255, 200, 130, 0.18) 0%, rgba(255, 200, 130, 0.06) 35%, transparent 70%)",
          }}
          animate={{ opacity: isSummer ? 0 : 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </div>

      {/* Flocons — fade out en mode été */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        animate={{ opacity: isSummer ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {SNOWFLAKES.map((flake, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              boxShadow: `0 0 ${flake.glow} rgba(255,255,255,0.8)`,
              opacity: flake.opacity,
            }}
            initial={{ top: "-5%" }}
            animate={{ top: ["-5%", "105%"] }}
            transition={{
              duration: flake.duration,
              delay: flake.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}
