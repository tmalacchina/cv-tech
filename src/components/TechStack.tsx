// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "./AnimatedSection";
import data from "@/data/data.json";

const badgeIcons: Record<string, string> = {
  "Anthropic":   "◈",
  "Mistral API": "⚡",
  "OpenAI":      "◯",
  "n8n":         "⇄",
  "Zapier":      "⚡",
  "Claude Code": "⌨",
  "Next.js":     "▲",
};

const DESCRIPTION =
  "From raw LLM APIs to sophisticated no-code orchestration, this ecosystem is my command center. " +
  "It is not just a toolset, but a strategic platform I use to audit business processes, identify high-ROI opportunities, " +
  "and rapidly build bespoke, scalable AI solutions. My approach blends the precision of aerospace engineering with the " +
  "agility of modern low-code, creating measurable business value.";

export default function TechStack() {
  const { tech_stack } = data;

  return (
    <section id="stack" className="relative px-6 py-28 overflow-hidden">
      {/* Horizon atmospheric separator — sky fading to ground */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9,22,40,0.8) 0%, transparent 100%)",
        }}
      />

      {/* Subtle ground texture (faint horizontal stripes) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(59,130,246,0.6) 0px, transparent 1px, transparent 48px, rgba(59,130,246,0.6) 49px)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--blue-bright)" }}>
            01 — Tech Stack
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 tracking-tight">
            Building Intelligence
          </h2>
          <p className="text-sm leading-relaxed mb-12 max-w-2xl" style={{ color: "var(--muted)" }}>
            {DESCRIPTION}
          </p>
        </FadeUp>

        <StaggerContainer className="flex flex-wrap gap-3">
          {tech_stack.map((tech) => (
            <motion.span
              key={tech}
              variants={staggerItem}
              whileHover={{ scale: 1.07, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium cursor-default select-none"
              style={{
                border: "1px solid rgba(10,78,158,0.3)",
                background: "rgba(10,78,158,0.07)",
                color: "#93b4d8",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s, color 0.18s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(10,78,158,0.8)";
                el.style.background  = "rgba(10,78,158,0.22)";
                el.style.boxShadow   = "0 0 22px rgba(10,78,158,0.38), 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)";
                el.style.color       = "#7eb8ff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(10,78,158,0.3)";
                el.style.background  = "rgba(10,78,158,0.07)";
                el.style.boxShadow   = "inset 0 1px 0 rgba(255,255,255,0.05)";
                el.style.color       = "#93b4d8";
              }}
            >
              {badgeIcons[tech] && (
                <span className="text-sm leading-none opacity-60">{badgeIcons[tech]}</span>
              )}
              {tech}
            </motion.span>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
