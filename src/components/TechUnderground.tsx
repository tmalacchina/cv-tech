"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/* =================================================================
 * SKILLS — 4 catégories + langues (inchangé depuis V1)
 * ================================================================= */

const SKILLS_CATEGORIES = [
  {
    id: "dev",
    label: "Développement",
    eyebrow: "Construire l'outil",
    borderClass: "border-amber-400/25 hover:border-amber-300/60",
    dotClass: "bg-amber-300",
    glowClass: "from-amber-500/10 to-transparent",
    skills: [
      "Python (collecte, traitement, APIs)",
      "React / Next.js",
      "TypeScript / JavaScript",
      "APIs REST & intégrations",
      "Prototypage rapide d'outils métier",
      "Claude Code / dev assisté par IA",
    ],
  },
  {
    id: "data-iot",
    label: "Data & IoT",
    eyebrow: "De la donnée terrain au dashboard",
    borderClass: "border-sky-400/25 hover:border-sky-300/60",
    dotClass: "bg-sky-300",
    glowClass: "from-sky-500/10 to-transparent",
    skills: [
      "Remontée de données capteurs",
      "Pipelines de collecte & traitement",
      "Séries temporelles (time-series)",
      "Dashboards de monitoring temps réel",
      "Bases de données (SQL / NoSQL)",
      "Supervision d'équipements industriels",
    ],
  },
  {
    id: "methodes",
    label: "Méthodes & Outils",
    eyebrow: "Cadrer, suivre, documenter",
    borderClass: "border-emerald-400/25 hover:border-emerald-300/60",
    dotClass: "bg-emerald-300",
    glowClass: "from-emerald-500/10 to-transparent",
    skills: [
      "Git / GitHub (versioning)",
      "Jira (sprints, suivi de tickets)",
      "Confluence (documentation)",
      "Méthodologie Agile / Scrum",
      "Automation (n8n, Make, Zapier)",
      "Dialogue technique ↔ métier",
    ],
  },
  {
    id: "soft",
    label: "Soft Skills",
    eyebrow: "Ce qui ne s'apprend pas en stack",
    borderClass: "border-slate-400/20 hover:border-slate-300/50",
    dotClass: "bg-slate-400",
    glowClass: "from-slate-400/10 to-transparent",
    skills: [
      "Curiosité technique (veille active)",
      "Autonomie sur problèmes techniques",
      "Créativité",
      "Adaptabilité (1 an en Colombie)",
      "Esprit d'équipe (rugby +20 ans)",
      "Aventurier, fiable et sociable",
    ],
  },
];

const LANGUAGES = [
  { lang: "Français", level: "Natif", percent: 100 },
  { lang: "Espagnol", level: "Bilingue", percent: 95 },
  { lang: "Anglais", level: "C1 · TOEIC 795", percent: 85 },
];

/* =================================================================
 * RACINES — palettes multi-couches par tier
 * =================================================================
 * Chaque tier a un tableau de "couches" (layer) qui sont des paths
 * superposés avec largeur décroissante et couleur de plus en plus
 * claire. Le rendu donne un volume cylindrique réaliste, pas une
 * ligne plate.
 * ================================================================= */

type Tier = "thick" | "medium" | "thin" | "capillary";

const PALETTES: Record<
  Tier,
  { width: number; color: string; opacity: number }[]
> = {
  thick: [
    { width: 22, color: "#08040200", opacity: 0 }, // placeholder pour ombre douce
    { width: 18, color: "#0E0805", opacity: 0.95 }, // ombre extérieure
    { width: 13, color: "#1F1209", opacity: 1 }, // base sombre
    { width: 9, color: "#3D2614", opacity: 1 }, // mid brown
    { width: 5, color: "#6B4423", opacity: 1 }, // brun chaud
    { width: 2, color: "#A87650", opacity: 0.85 }, // highlight
  ],
  medium: [
    { width: 14, color: "#0E0805", opacity: 0.85 }, // ombre
    { width: 10, color: "#1F1209", opacity: 1 },
    { width: 6, color: "#3D2614", opacity: 1 },
    { width: 3, color: "#6B4423", opacity: 1 },
    { width: 1, color: "#9C7048", opacity: 0.8 },
  ],
  thin: [
    { width: 6, color: "#1A0F07", opacity: 0.85 },
    { width: 3.5, color: "#3D2614", opacity: 1 },
    { width: 1.6, color: "#6B4423", opacity: 0.95 },
    { width: 0.6, color: "#8B5E2F", opacity: 0.7 },
  ],
  capillary: [
    { width: 2, color: "#3D2614", opacity: 0.9 },
    { width: 0.9, color: "#6B4423", opacity: 0.75 },
  ],
};

/* =================================================================
 * Données des 7 systèmes racinaires
 * =================================================================
 * Chaque segment = [d, tier, tierAnimIndex]
 *   - d : path SVG (Bézier)
 *   - tier : "thick" | "medium" | "thin" | "capillary"
 *   - tierAnimIndex : 0..3 pour mapper sur la fenêtre d'animation
 *     (0=trunk first, 3=capillaries last)
 *
 * Conventions :
 *   - viewBox 1600 x 1800
 *   - les troncs partent de y=0 (sous la skyline) et descendent
 *   - les capillaires terminent vers y=900-1500
 * ================================================================= */

type Segment = [string, Tier, number];

const SYSTEMS: Segment[][] = [
  // ============================================================
  // SYSTÈME 1 — x ≈ 110 (sous le building 2 — tall slim)
  // ============================================================
  [
    // Tronc principal
    ["M 110 0 C 95 90 130 200 105 290", "thick", 0],
    ["M 105 290 C 120 380 90 470 110 560", "medium", 1],
    ["M 110 560 C 100 650 115 740 105 830", "thin", 2],
    ["M 105 830 C 110 900 100 970 105 1040", "capillary", 3],
    // Branche gauche
    ["M 105 220 C 70 280 40 360 25 440", "medium", 1],
    ["M 25 440 C 15 510 5 580 15 640", "thin", 2],
    ["M 15 640 C 5 700 10 760 5 810", "capillary", 3],
    ["M 25 440 C 0 480 -5 530 -10 580", "capillary", 3],
    // Branche droite
    ["M 110 380 C 145 440 180 510 195 580", "medium", 1],
    ["M 195 580 C 210 650 200 720 215 780", "thin", 2],
    ["M 195 580 C 230 620 240 660 235 700", "capillary", 3],
    // Capillaire centre
    ["M 110 480 C 80 530 60 580 70 620", "capillary", 3],
  ],

  // ============================================================
  // SYSTÈME 2 — x ≈ 263 (sous l'antenna 240h, très haute)
  // ============================================================
  [
    // Tronc puissant
    ["M 263 0 C 250 100 275 220 258 320", "thick", 0],
    ["M 258 320 C 268 430 248 540 262 640", "medium", 1],
    ["M 262 640 C 252 740 268 840 258 940", "thin", 2],
    ["M 258 940 C 263 1020 253 1100 260 1180", "capillary", 3],
    // Branche L1
    ["M 258 260 C 220 320 195 400 185 470", "medium", 1],
    ["M 185 470 C 175 540 165 610 170 670", "thin", 2],
    ["M 170 670 C 160 730 165 790 155 840", "capillary", 3],
    ["M 185 470 C 155 510 140 560 145 610", "capillary", 3],
    // Branche L2
    ["M 260 540 C 220 600 195 680 180 760", "medium", 1],
    ["M 180 760 C 170 830 175 890 165 940", "thin", 2],
    // Branche R1
    ["M 263 380 C 305 440 340 510 355 580", "medium", 1],
    ["M 355 580 C 365 650 355 720 370 780", "thin", 2],
    ["M 355 580 C 390 620 405 660 400 700", "capillary", 3],
    // Branche R2
    ["M 262 720 C 300 790 335 860 345 930", "medium", 1],
    ["M 345 930 C 355 990 345 1050 355 1100", "thin", 2],
    // Capillaires denses
    ["M 258 460 C 230 500 215 540 220 580", "capillary", 3],
    ["M 262 850 C 240 900 230 950 235 1000", "capillary", 3],
  ],

  // ============================================================
  // SYSTÈME 3 — x ≈ 510 (sous le wide block 110w x 200h)
  // ============================================================
  [
    // Tronc principal
    ["M 510 0 C 495 100 525 200 508 300", "thick", 0],
    ["M 508 300 C 520 400 495 510 510 610", "medium", 1],
    ["M 510 610 C 500 700 515 800 505 890", "thin", 2],
    ["M 505 890 C 510 970 500 1050 505 1130", "capillary", 3],
    // Branche L1 (large spread)
    ["M 510 220 C 460 290 410 370 380 450", "thick", 0],
    ["M 380 450 C 360 520 345 590 350 660", "medium", 1],
    ["M 350 660 C 340 730 345 800 335 860", "thin", 2],
    ["M 350 660 C 320 700 305 750 310 800", "capillary", 3],
    // Branche L2
    ["M 508 480 C 470 550 440 620 425 690", "medium", 1],
    ["M 425 690 C 415 760 425 820 415 880", "thin", 2],
    // Branche R1 (large spread aussi)
    ["M 510 240 C 565 310 610 390 635 470", "thick", 0],
    ["M 635 470 C 655 540 670 610 665 680", "medium", 1],
    ["M 665 680 C 655 750 660 820 670 880", "thin", 2],
    ["M 665 680 C 700 720 715 770 710 820", "capillary", 3],
    // Branche R2
    ["M 510 520 C 555 580 590 640 605 710", "medium", 1],
    ["M 605 710 C 615 780 610 840 620 900", "thin", 2],
    // Capillaires
    ["M 380 450 C 350 490 335 530 340 570", "capillary", 3],
    ["M 635 470 C 670 510 685 550 680 590", "capillary", 3],
    ["M 510 760 C 480 810 470 860 475 910", "capillary", 3],
  ],

  // ============================================================
  // SYSTÈME 4 — x ≈ 765 (STEPPED TOWER 130w x 230h, le PLUS BIG)
  // C'est le système le plus dense — centre nerveux de la
  // composition.
  // ============================================================
  [
    // Tronc CENTRAL très épais
    ["M 765 0 C 750 110 780 230 760 340", "thick", 0],
    ["M 760 340 C 775 460 750 580 770 700", "thick", 0],
    ["M 770 700 C 760 810 775 920 765 1030", "medium", 1],
    ["M 765 1030 C 770 1130 760 1230 765 1320", "thin", 2],
    ["M 765 1320 C 770 1410 760 1500 765 1580", "capillary", 3],
    // Grande branche L1
    ["M 760 240 C 700 320 640 410 615 500", "thick", 0],
    ["M 615 500 C 600 580 585 660 590 740", "medium", 1],
    ["M 590 740 C 580 820 585 900 575 970", "thin", 2],
    ["M 575 970 C 570 1040 580 1110 570 1170", "capillary", 3],
    // Grande branche L2
    ["M 765 460 C 715 540 670 620 655 700", "medium", 1],
    ["M 655 700 C 645 780 650 860 640 930", "thin", 2],
    ["M 655 700 C 620 760 605 820 610 880", "capillary", 3],
    // Branche L3 (basse)
    ["M 770 820 C 720 890 685 960 680 1030", "medium", 1],
    ["M 680 1030 C 670 1100 675 1170 685 1230", "thin", 2],
    // Grande branche R1 (mirror de L1)
    ["M 760 280 C 825 360 880 450 905 540", "thick", 0],
    ["M 905 540 C 920 620 935 700 930 780", "medium", 1],
    ["M 930 780 C 940 860 935 940 945 1010", "thin", 2],
    ["M 945 1010 C 950 1080 940 1150 950 1210", "capillary", 3],
    // Grande branche R2
    ["M 765 500 C 815 580 860 660 875 740", "medium", 1],
    ["M 875 740 C 885 820 880 900 890 970", "thin", 2],
    ["M 875 740 C 910 800 925 860 920 920", "capillary", 3],
    // Branche R3 (basse)
    ["M 770 860 C 820 930 855 1000 860 1070", "medium", 1],
    ["M 860 1070 C 870 1140 865 1210 855 1270", "thin", 2],
    // Sous-ramifs et capillaires denses (le big one)
    ["M 615 500 C 580 540 565 580 570 620", "capillary", 3],
    ["M 905 540 C 940 580 955 620 950 660", "capillary", 3],
    ["M 590 740 C 555 790 540 840 545 890", "capillary", 3],
    ["M 930 780 C 965 830 980 880 975 930", "capillary", 3],
    ["M 765 600 C 730 660 715 720 720 770", "capillary", 3],
    ["M 765 600 C 800 660 815 720 810 770", "capillary", 3],
    ["M 770 1100 C 735 1170 720 1240 725 1300", "capillary", 3],
    ["M 770 1100 C 805 1170 820 1240 815 1300", "capillary", 3],
  ],

  // ============================================================
  // SYSTÈME 5 — x ≈ 970 (pointy 100w x 195h)
  // ============================================================
  [
    // Tronc
    ["M 970 0 C 955 100 985 210 968 310", "thick", 0],
    ["M 968 310 C 980 410 955 520 970 620", "medium", 1],
    ["M 970 620 C 960 710 975 800 965 890", "thin", 2],
    ["M 965 890 C 970 970 960 1050 965 1130", "capillary", 3],
    // Branche L1
    ["M 968 250 C 920 320 880 400 865 480", "medium", 1],
    ["M 865 480 C 850 550 840 620 845 690", "thin", 2],
    ["M 845 690 C 835 760 845 820 835 870", "capillary", 3],
    ["M 865 480 C 830 520 815 570 820 620", "capillary", 3],
    // Branche L2
    ["M 970 540 C 935 600 905 670 895 740", "medium", 1],
    ["M 895 740 C 885 810 895 870 885 920", "thin", 2],
    // Branche R1
    ["M 970 290 C 1015 360 1050 440 1065 520", "medium", 1],
    ["M 1065 520 C 1075 590 1085 660 1080 730", "thin", 2],
    ["M 1065 520 C 1100 560 1115 600 1110 640", "capillary", 3],
    // Branche R2 plus profonde
    ["M 970 580 C 1010 650 1040 720 1055 790", "medium", 1],
    ["M 1055 790 C 1065 860 1060 920 1070 980", "thin", 2],
    // Capillaires
    ["M 968 460 C 940 510 925 560 930 600", "capillary", 3],
    ["M 970 760 C 940 810 930 860 935 910", "capillary", 3],
  ],

  // ============================================================
  // SYSTÈME 6 — x ≈ 1212 (antenna 240h, très haute, mirror sys 2)
  // ============================================================
  [
    // Tronc puissant
    ["M 1212 0 C 1225 100 1200 220 1217 320", "thick", 0],
    ["M 1217 320 C 1207 430 1227 540 1213 640", "medium", 1],
    ["M 1213 640 C 1223 740 1207 840 1217 940", "thin", 2],
    ["M 1217 940 C 1212 1020 1222 1100 1215 1180", "capillary", 3],
    // Branche R1 (vers la droite)
    ["M 1217 260 C 1255 320 1280 400 1290 470", "medium", 1],
    ["M 1290 470 C 1300 540 1310 610 1305 670", "thin", 2],
    ["M 1305 670 C 1315 730 1310 790 1320 840", "capillary", 3],
    ["M 1290 470 C 1320 510 1335 560 1330 610", "capillary", 3],
    // Branche R2
    ["M 1215 540 C 1255 600 1280 680 1295 760", "medium", 1],
    ["M 1295 760 C 1305 830 1300 890 1310 940", "thin", 2],
    // Branche L1 (vers la gauche)
    ["M 1212 380 C 1170 440 1135 510 1120 580", "medium", 1],
    ["M 1120 580 C 1110 650 1120 720 1105 780", "thin", 2],
    ["M 1120 580 C 1085 620 1070 660 1075 700", "capillary", 3],
    // Branche L2
    ["M 1213 720 C 1175 790 1140 860 1130 930", "medium", 1],
    ["M 1130 930 C 1120 990 1130 1050 1120 1100", "thin", 2],
    // Capillaires
    ["M 1217 460 C 1245 500 1260 540 1255 580", "capillary", 3],
    ["M 1213 850 C 1235 900 1245 950 1240 1000", "capillary", 3],
  ],

  // ============================================================
  // SYSTÈME 7 — x ≈ 1482 (pointy 95w x 195h, droit, équilibre)
  // ============================================================
  [
    // Tronc
    ["M 1482 0 C 1495 100 1467 200 1485 300", "thick", 0],
    ["M 1485 300 C 1475 400 1495 510 1480 610", "medium", 1],
    ["M 1480 610 C 1490 700 1475 790 1485 880", "thin", 2],
    ["M 1485 880 C 1480 960 1490 1040 1483 1110", "capillary", 3],
    // Branche L1 (vers la gauche)
    ["M 1482 240 C 1435 310 1395 390 1380 470", "medium", 1],
    ["M 1380 470 C 1370 540 1360 610 1365 680", "thin", 2],
    ["M 1365 680 C 1355 750 1365 810 1355 860", "capillary", 3],
    ["M 1380 470 C 1345 510 1330 560 1335 610", "capillary", 3],
    // Branche L2
    ["M 1483 530 C 1445 600 1415 670 1405 740", "medium", 1],
    ["M 1405 740 C 1395 810 1405 870 1395 920", "thin", 2],
    // Branche R1
    ["M 1482 280 C 1525 350 1560 430 1575 510", "medium", 1],
    ["M 1575 510 C 1585 580 1595 650 1590 720", "thin", 2],
    ["M 1575 510 C 1610 550 1625 590 1620 630", "capillary", 3],
    // Capillaires
    ["M 1485 460 C 1455 510 1440 560 1445 600", "capillary", 3],
    ["M 1480 750 C 1450 800 1440 850 1445 900", "capillary", 3],
    ["M 1483 950 C 1505 1000 1515 1050 1510 1100", "capillary", 3],
  ],
];

/* =================================================================
 * Composant — un segment racinaire, multi-couches
 * =================================================================
 * On rend N <motion.path> superposés, tous animés ensemble via la
 * même MotionValue (pathLength). Largeurs et couleurs décroissantes
 * créent l'illusion d'un volume cylindrique.
 * ================================================================= */

function RootSegment({
  d,
  tier,
  pathLength,
}: {
  d: string;
  tier: Tier;
  pathLength: MotionValue<number>;
}) {
  const layers = PALETTES[tier];
  return (
    <>
      {layers.map((layer, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={layer.color}
          strokeOpacity={layer.opacity}
          strokeWidth={layer.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ pathLength }}
        />
      ))}
    </>
  );
}

/* =================================================================
 * Petites particules de terre/cailloux pour la texture
 * ================================================================= */

const SOIL_PARTICLES = Array.from({ length: 60 }, (_, i) => {
  const seed = (n: number) => {
    const x = Math.sin(n * 23.7 + 11.3) * 10000;
    return x - Math.floor(x);
  };
  const r = (n: number) => Number(n.toFixed(3));
  return {
    cx: r(seed(i * 1.7) * 1600),
    cy: r(seed(i * 2.9) * 1800),
    radius: r(0.6 + seed(i * 3.7) * 1.6),
    opacity: r(0.15 + seed(i * 5.1) * 0.35),
  };
});

/* =================================================================
 * TechUnderground (Section 3) — Racines réalistes + Skills + Langues
 * ================================================================= */

export default function TechUnderground() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Une motion value par tier — partagée par tous les segments du tier
  const tier0 = useTransform(scrollYProgress, [0.0, 0.32], [0, 1]); // troncs
  const tier1 = useTransform(scrollYProgress, [0.1, 0.46], [0, 1]); // branches
  const tier2 = useTransform(scrollYProgress, [0.22, 0.6], [0, 1]); // tips
  const tier3 = useTransform(scrollYProgress, [0.36, 0.78], [0, 1]); // capillaires

  const tierMVs = [tier0, tier1, tier2, tier3];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #1A0E07 0%, #120A05 25%, #0A0604 60%, #050302 100%)",
      }}
    >
      {/* Transition douce depuis la skyline noire de la Section 2 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-12 md:h-32"
        style={{
          background:
            "linear-gradient(to bottom, #050810 0%, rgba(26,14,7,0.6) 60%, transparent 100%)",
        }}
      />

      {/* Grain / noise CSS pour texturer la terre */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(120,80,40,0.4) 0%, transparent 35%), radial-gradient(circle at 70% 60%, rgba(80,50,25,0.3) 0%, transparent 40%), radial-gradient(circle at 50% 90%, rgba(60,35,15,0.4) 0%, transparent 45%)",
        }}
      />

      {/* SVG des racines + particules de terre — z-0 */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg
          viewBox="0 0 1600 1800"
          preserveAspectRatio="xMidYMin slice"
          className="h-full w-full"
        >
          {/* Petits cailloux/grains de terre */}
          <g>
            {SOIL_PARTICLES.map((p, i) => (
              <circle
                key={`soil-${i}`}
                cx={p.cx}
                cy={p.cy}
                r={p.radius}
                fill="#3D2614"
                opacity={p.opacity}
              />
            ))}
          </g>

          {/* Tous les segments racinaires de tous les systèmes */}
          {SYSTEMS.flatMap((segments, sysIdx) =>
            segments.map((seg, segIdx) => (
              <RootSegment
                key={`s${sysIdx}-${segIdx}`}
                d={seg[0]}
                tier={seg[1]}
                pathLength={tierMVs[seg[2]]}
              />
            ))
          )}
        </svg>
      </div>

      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-16 text-center md:px-12 md:pt-52"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">
          Racines
        </p>
        <h2 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          Ce qui ancre tout ça.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-slate-200 md:text-lg">
          Sous chaque outil livré et chaque donnée remontée du terrain, un système racinaire : du code, de la data et de la méthode qui se renforcent mutuellement.
        </p>
      </motion.div>

      {/* Skills par catégories */}
      <div className="relative z-10 mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-6 px-6 md:mt-32 md:grid-cols-2 md:gap-8 md:px-12">
        {SKILLS_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
            className={`group relative overflow-hidden rounded-2xl border ${cat.borderClass} bg-black/40 p-6 backdrop-blur-md transition-colors duration-300 md:p-8`}
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${cat.glowClass} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />

            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 md:text-xs">
                {cat.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">
                {cat.label}
              </h3>
              <ul className="mt-6 space-y-3">
                {cat.skills.map((skill, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-300 md:text-base"
                  >
                    <span
                      className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${cat.dotClass}`}
                    />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Encart Langues */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto mt-16 max-w-4xl px-6 pb-32 md:mt-24 md:px-12 md:pb-48"
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-amber-400/20 p-6 backdrop-blur-md md:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(120, 75, 30, 0.22) 0%, rgba(40, 25, 12, 0.4) 100%)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">
            Polyglotte
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            Trois langues, trois mondes.
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Je négocie aussi bien à Paris qu'à Madrid ou à Bogota. Une langue,
            c'est rarement juste une langue : c'est une façon de penser un deal.
          </p>

          <div className="mt-8 space-y-6">
            {LANGUAGES.map((lang, i) => (
              <div key={lang.lang}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-base font-medium text-white md:text-lg">
                    {lang.lang}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-amber-300/80 md:text-sm">
                    {lang.level}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: lang.percent / 100 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3 + i * 0.2,
                      ease: "easeOut",
                    }}
                    style={{ transformOrigin: "left" }}
                    className="h-full w-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
