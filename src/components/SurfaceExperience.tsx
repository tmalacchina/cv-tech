// @ts-nocheck
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import data from "@/data/data.json";

/* ── Types ──────────────────────────────────────────────────────── */
type Job = typeof data.experience[0];

/* ── City skyline — deterministic rects, no random, no state ────── */
const BUILDINGS = [
  { l: "6%",  h: 62, w: 36 }, { l: "11%", h: 44, w: 22 },
  { l: "16%", h: 78, w: 52 }, { l: "24%", h: 50, w: 28 },
  { l: "30%", h: 66, w: 44 }, { l: "38%", h: 38, w: 18 },
  { l: "43%", h: 72, w: 48 }, { l: "52%", h: 54, w: 32 },
  { l: "59%", h: 82, w: 58 }, { l: "69%", h: 46, w: 26 },
  { l: "76%", h: 60, w: 40 }, { l: "83%", h: 50, w: 24 },
  { l: "89%", h: 68, w: 46 },
];

/* ── Per-card scroll-driven entrance ────────────────────────────── */
function ExperienceCard({ job, index }: { job: Job; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  /* Each card animates in as it enters the viewport */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 50%"],
  });

  const y       = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className="relative group"
      style={{ y, opacity }}
    >
      {/* Orange runway-light dot */}
      <div className="absolute -left-9 top-[22px] flex items-center justify-center">
        <motion.div
          className="absolute w-5 h-5 rounded-full"
          style={{ background: "#FF7F11" }}
          animate={{ scale: [1, 1.9, 1], opacity: [0, 0.18, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, delay: index * 0.65, ease: "easeOut" }}
        />
        <div
          className="relative w-2.5 h-2.5 rounded-full z-10 transition-transform duration-300 group-hover:scale-125"
          style={{ background: "#FF7F11", boxShadow: "0 0 0 3px #0F172A, 0 0 10px rgba(255,127,17,0.5)" }}
        />
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="rounded-2xl p-6 border"
        style={{
          background: "rgba(14, 22, 40, 0.8)",
          borderColor: "rgba(26,44,68,0.8)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(10,78,158,0.45)";
          el.style.boxShadow   = "0 0 28px rgba(10,78,158,0.14), 0 8px 32px rgba(0,0,0,0.45)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(26,44,68,0.8)";
          el.style.boxShadow   = "0 2px 10px rgba(0,0,0,0.35)";
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white leading-snug">{job.role}</h3>
            <p className="text-sm mt-0.5 font-medium" style={{ color: "#FF7F11" }}>{job.company}</p>
          </div>
          <span
            className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-lg self-start"
            style={{
              color: "#3b82f6",
              background: "rgba(59,130,246,0.07)",
              border: "1px solid rgba(59,130,246,0.16)",
            }}
          >
            {job.date}
          </span>
        </div>
        <ul className="space-y-2">
          {job.bullets.map((bullet, j) => (
            <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "#64748b" }}>
              <span className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-blue-500 opacity-60" />
              {bullet}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

/* ── Section header scroll-driven entrance ───────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 50%"] });
  const y       = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#3b82f6" }}>
        02 — Experience
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-14 tracking-tight">
        Where I&apos;ve worked
      </h2>
    </motion.div>
  );
}

export default function SurfaceExperience() {
  const { experience } = data;

  return (
    <section id="experience" className="relative overflow-hidden py-28 px-6">

      {/* ── Urban horizon silhouette at the top ───────────────────── */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-24 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {BUILDINGS.map((b, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{ left: b.l, width: b.w, height: b.h, background: "rgba(4, 8, 18, 0.92)" }}
          />
        ))}
        {/* Blend into section */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, transparent 0%, rgba(4,8,18,0.5) 100%)" }} />
      </div>

      {/* Dashed runway timeline line */}
      <div className="absolute left-6 sm:left-[calc((100%-1024px)/2+24px)] top-32 bottom-0 pointer-events-none" style={{ width: 1, zIndex: 2 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(to bottom, #0A4E9E 0px, #0A4E9E 12px, transparent 12px, transparent 24px)",
          opacity: 0.55,
        }} />
      </div>

      <div className="relative max-w-5xl mx-auto" style={{ zIndex: 3 }}>
        <SectionHeader />

        <div className="space-y-10 pl-9">
          {experience.map((job, i) => (
            <ExperienceCard key={i} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
