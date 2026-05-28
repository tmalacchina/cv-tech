// @ts-nocheck
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import data from "@/data/data.json";

/* ── Icon map ────────────────────────────────────────────────────── */
const ICONS: Record<string, string> = {
  "Anthropic": "◈", "Mistral API": "⚡", "OpenAI": "◯",
  "n8n": "⇄",       "Zapier": "⚡",      "Claude Code": "⌨",
  "Next.js": "▲",
};

const STACK_DESC =
  "From raw LLM APIs to sophisticated no-code orchestration, this ecosystem is my command center. " +
  "Not just a toolset — a strategic platform I use to audit business processes, identify high-ROI " +
  "opportunities, and rapidly build bespoke, scalable AI solutions.";

/* ── Scroll-driven reveal wrapper ─────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 52%"] });
  const y       = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div ref={ref} style={{ y, opacity, transitionDelay: `${delay}s` }}>
      {children}
    </motion.div>
  );
}

/* ── Project card — own component so hooks are valid ─────────────── */
type Project = typeof data.projects[0];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 55%"] });
  const y       = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      <motion.a
        href={project.link}
        whileHover={{ y: -8, scale: 1.018 }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: "spring", stiffness: 310, damping: 20 }}
        className="group relative flex flex-col justify-between p-7 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0c0904 0%, #080602 100%)",
          border: "1px solid rgba(160,80,0,0.18)",
          boxShadow:
            "inset 0 -50px 80px rgba(255,100,0,0.07), " +
            "0 2px 12px rgba(0,0,0,0.6)",
          transition: "border-color 0.22s, box-shadow 0.22s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,127,17,0.4)";
          el.style.boxShadow =
            "inset 0 -70px 100px rgba(255,100,0,0.14), " +
            "inset 0 0 40px rgba(255,127,17,0.03), " +
            "0 0 40px rgba(255,100,0,0.15), " +
            "0 0 0 1px rgba(255,127,17,0.2), " +
            "0 20px 50px rgba(0,0,0,0.7)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(160,80,0,0.18)";
          el.style.boxShadow =
            "inset 0 -50px 80px rgba(255,100,0,0.07), " +
            "0 2px 12px rgba(0,0,0,0.6)";
        }}
      >
        {/* Magma seep from bottom */}
        <div aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(to top, rgba(255,80,0,0.11) 0%, transparent 100%)" }}
        />
        {/* Rock crack at top */}
        <div aria-hidden className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,127,17,0.22), transparent)" }} />

        {/* Arrow */}
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF7F11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FF7F11", boxShadow: "0 0 6px rgba(255,127,17,0.8)" }} />
            <span className="text-xs font-mono" style={{ color: "#e08030" }}>
              LAYER-0{index + 1}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white mb-3 leading-snug pr-6">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#4a3a2a" }}>
            {project.description}
          </p>
        </div>

        <div className="mt-7 pt-5 flex items-center justify-between border-t"
          style={{ borderColor: "rgba(160,80,0,0.16)" }}>
          <span className="text-xs font-mono transition-colors duration-200 group-hover:text-[#FF7F11]"
            style={{ color: "#2e1e0e" }}>
            Excavate →
          </span>
          <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ background: "rgba(255,127,17,0.1)", border: "1px solid rgba(255,127,17,0.28)", boxShadow: "0 0 10px rgba(255,127,17,0.22)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF7F11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

/* ── Main section ─────────────────────────────────────────────────── */
export default function UndergroundTech() {
  const { tech_stack, projects } = data;

  return (
    <section id="projects" className="relative overflow-hidden px-6 py-28">

      {/* ── Magma light sources ────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(255,100,0,0.13) 0%, rgba(255,127,17,0.05) 35%, transparent 68%)", filter: "blur(18px)" }} />
        <div className="absolute bottom-0 left-[12%] w-[300px] h-[260px]"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(255,80,0,0.10) 0%, transparent 65%)", filter: "blur(28px)" }} />
        <div className="absolute bottom-0 right-[10%] w-[240px] h-[200px]"
          style={{ background: "radial-gradient(ellipse at center bottom, rgba(255,140,0,0.08) 0%, transparent 65%)", filter: "blur(26px)" }} />
        <div className="absolute top-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto" style={{ zIndex: 2 }}>

        {/* ═══ TECH STACK ══════════════════════════════════════════ */}
        <Reveal>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#e08030" }}>
            01 — Tech Stack
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight">
            Building Intelligence
          </h2>
          <p className="text-sm leading-relaxed mb-10 max-w-2xl" style={{ color: "#4a3520" }}>
            {STACK_DESC}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="flex flex-wrap gap-3 mb-28">
            {tech_stack.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.07, y: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium cursor-default select-none"
                style={{
                  border: "1px solid rgba(255,127,17,0.22)",
                  background: "rgba(255,127,17,0.04)",
                  color: "#7a5a38",
                  boxShadow: "inset 0 1px 0 rgba(255,200,100,0.05)",
                  transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#FF7F11";
                  el.style.background  = "rgba(255,127,17,0.12)";
                  el.style.color       = "#FF7F11";
                  el.style.boxShadow   = "0 0 18px rgba(255,127,17,0.35), inset 0 0 14px rgba(255,127,17,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,127,17,0.22)";
                  el.style.background  = "rgba(255,127,17,0.04)";
                  el.style.color       = "#7a5a38";
                  el.style.boxShadow   = "inset 0 1px 0 rgba(255,200,100,0.05)";
                }}
              >
                {ICONS[tech] && <span className="text-sm leading-none opacity-50">{ICONS[tech]}</span>}
                {tech}
              </motion.span>
            ))}
          </div>
        </Reveal>

        {/* ═══ PROJECTS ════════════════════════════════════════════ */}
        <Reveal>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#e08030" }}>
            03 — Projects
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-14 tracking-tight">
            Things I&apos;ve built
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
