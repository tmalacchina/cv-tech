// @ts-nocheck
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import data from "@/data/data.json";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type CloudDef = {
  width: string; opacity: number; scaleX: 1 | -1;
  right?: string; left?: string; top?: string; bottom?: string;
};

/*
 * Cloud layout — 4 instances of cloud.png, 2 behind photo (z:10) and 2 in front (z:30).
 * mix-blend-mode: screen makes the dark sky of the PNG invisible on the dark background,
 * leaving only the bright cloud shapes visible.
 */
const BG_CLOUDS: CloudDef[] = [
  { right: "-5%", top: "3%",  width: "clamp(280px, 48vw, 680px)", opacity: 0.55, scaleX:  1 },
  { left:  "5%",  top: "32%", width: "clamp(200px, 34vw, 480px)", opacity: 0.35, scaleX: -1 },
];

const FG_CLOUDS: CloudDef[] = [
  { right: "-2%",  top: "-4%",  width: "clamp(240px, 40vw, 540px)", opacity: 0.72, scaleX:  1 },
  { right: "-6%",  bottom: "8%",width: "clamp(200px, 32vw, 420px)", opacity: 0.60, scaleX: -1 },
];

export default function Hero() {
  const { personal_info } = data;
  const heroRef = useRef<HTMLElement>(null);

  /* Scroll progress scoped to this section (0 = in view, 1 = fully scrolled away) */
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* ── Parallax transforms (no filter:blur, GPU-friendly transforms only) ── */

  /* Background clouds — slow */
  const rawBgY = useTransform(heroScroll, [0, 1], ["0px", "-50px"]);
  const rawBgX = useTransform(heroScroll, [0, 1], ["0px", "-20px"]);
  const bgY    = useSpring(rawBgY, { stiffness: 80, damping: 26, mass: 0.8 });
  const bgX    = useSpring(rawBgX, { stiffness: 80, damping: 26, mass: 0.8 });

  /* Photo — medium */
  const rawPhotoY = useTransform(heroScroll, [0, 1], ["0px", "-100px"]);
  const photoY    = useSpring(rawPhotoY, { stiffness: 80, damping: 26, mass: 0.8 });
  const photoScale = useTransform(heroScroll, [0, 0.7], [1, 1.04]);

  /* Foreground clouds — fast */
  const rawFgY = useTransform(heroScroll, [0, 1], ["0px", "-190px"]);
  const rawFgX = useTransform(heroScroll, [0, 1], ["0px", "30px"]);
  const fgY    = useSpring(rawFgY, { stiffness: 80, damping: 26, mass: 0.8 });
  const fgX    = useSpring(rawFgX, { stiffness: 80, damping: 26, mass: 0.8 });

  /* Text slides up slightly and fades as hero exits */
  const rawTextY   = useTransform(heroScroll, [0, 1], ["0px", "-55px"]);
  const textY      = useSpring(rawTextY, { stiffness: 80, damping: 26, mass: 0.8 });
  const textOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden">

      {/* Atmospheric vignette — pure CSS, no blur, no JS */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,8,18,0.5) 0%, transparent 35%, rgba(15,23,42,0.45) 100%)",
          zIndex: 2,
        }}
      />

      {/* Faint star field — static, no animation */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {[
          [7,5],[23,12],[41,8],[58,18],[74,4],[89,14],
          [15,28],[35,22],[53,31],[67,7],[82,25],[94,19],
          [3,40],[28,38],[49,44],[71,36],[88,42],[11,48],
        ].map(([l, t], i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${l}%`,
              top:  `${t}%`,
              width:  i % 4 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 2 : 1,
              opacity: 0.1 + (i % 5) * 0.04,
            }}
          />
        ))}
      </div>

      {/* ── BACKGROUND CLOUD LAYER (z:10 — behind photo) ─────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY, x: bgX, zIndex: 10 }}
      >
        {BG_CLOUDS.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              right:  c.right,
              left:   c.left,
              top:    c.top,
              bottom: c.bottom,
              width: c.width,
              opacity: c.opacity,
              transform: c.scaleX === -1 ? "scaleX(-1)" : undefined,
              mixBlendMode: "screen" as const,
            }}
          >
            <Image
              src="/cloud.png"
              alt=""
              width={940}
              height={788}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
        ))}
      </motion.div>

      {/* ── PHOTO — z:20, sandwiched between cloud layers ─────────── */}
      <motion.div
        className="absolute right-0 top-0 w-full lg:w-[50%] h-full hidden lg:flex items-center justify-end pr-6"
        style={{ y: photoY, scale: photoScale, zIndex: 20, willChange: "transform" }}
      >
        <motion.div
          whileHover={{ scale: 1.045 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          style={{
            /* drop-shadow for depth — does NOT blur a moving element, only creates shadow */
            filter: "drop-shadow(0 24px 60px rgba(255,127,17,0.28)) drop-shadow(0 4px 80px rgba(255,127,17,0.09))",
          }}
        >
          <Image
            src="/profile.png"
            alt="Thomas Malacchina"
            width={320}
            height={400}
            priority
            className="select-none"
            style={{ width: "clamp(190px, 22vw, 310px)", height: "auto" }}
          />
        </motion.div>
      </motion.div>

      {/* ── FOREGROUND CLOUD LAYER (z:30 — in front of photo) ────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ y: fgY, x: fgX, zIndex: 30 }}
      >
        {FG_CLOUDS.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              right:  c.right,
              left:   c.left,
              top:    c.top,
              bottom: c.bottom,
              width: c.width,
              opacity: c.opacity,
              transform: c.scaleX === -1 ? "scaleX(-1)" : undefined,
              mixBlendMode: "screen" as const,
            }}
          >
            <Image
              src="/cloud.png"
              alt=""
              width={940}
              height={788}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
        ))}
      </motion.div>

      {/* ── TEXT — z:40, slides gently and fades on exit ──────────── */}
      <motion.div
        className="relative flex items-center min-h-screen"
        style={{ y: textY, opacity: textOpacity, zIndex: 40 }}
      >
        <div className="max-w-5xl mx-auto w-full px-6 pt-28 pb-20">
          <div className="lg:w-[55%]">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {/* Location */}
              <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-8">
                <span className="inline-block h-px w-8" style={{ background: "var(--orange)" }} />
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--orange)" }}>
                  {personal_info.location}
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                variants={itemVariants}
                className="font-bold tracking-tighter leading-[1.03] mb-5"
                style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)" }}
              >
                <span className="block text-white">Thomas</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(105deg, #FF7F11 0%, #ffaa44 60%, #ffd27a 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Malacchina
                </span>
              </motion.h1>

              {/* Title */}
              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl font-light mb-5 max-w-sm"
                style={{ color: "var(--muted)" }}
              >
                {personal_info.title}
              </motion.p>

              {/* About */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base leading-relaxed mb-11 max-w-md"
                style={{ color: "#4a6080" }}
              >
                {personal_info.about}
              </motion.p>

              {/* Mobile photo */}
              <motion.div variants={itemVariants} className="lg:hidden flex justify-center mb-8">
                <div style={{ filter: "drop-shadow(0 16px 48px rgba(255,127,17,0.25))" }}>
                  <Image
                    src="/profile.png"
                    alt="Thomas Malacchina"
                    width={200}
                    height={260}
                    priority
                    style={{ width: 170, height: "auto" }}
                  />
                </div>
              </motion.div>

              {/* CTAs — no backdrop-filter */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <motion.a
                  href={`mailto:${personal_info.email}`}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      "0 0 0px 0px rgba(255,127,17,0)",
                      "0 0 20px 4px rgba(255,127,17,0.36)",
                      "0 0 0px 0px rgba(255,127,17,0)",
                    ],
                  }}
                  transition={{
                    boxShadow: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 380, damping: 20 },
                  }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-black"
                  style={{ background: "linear-gradient(135deg, #FF7F11 0%, #ff9c3a 100%)" }}
                >
                  Get in touch
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.a>

                <motion.a
                  href="#experience"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  className="inline-flex items-center px-7 py-3.5 rounded-xl text-sm font-medium"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    /* Solid semi-opaque — no backdrop-filter */
                    background: "rgba(255,255,255,0.04)",
                    color: "#94a3b8",
                  }}
                >
                  View experience
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-25"
        style={{ zIndex: 41 }}
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: "var(--muted)" }}>
          scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-400 to-transparent" />
      </div>
    </section>
  );
}
