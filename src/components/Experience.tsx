// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "./AnimatedSection";
import data from "@/data/data.json";

/* Dashed runway line rendered as repeating dashes */
function RunwayLine() {
  return (
    <div className="absolute left-0 top-3 bottom-0" style={{ width: 1 }}>
      {/* Solid base */}
      <div className="absolute inset-0" style={{ background: "rgba(10,78,158,0.12)" }} />
      {/* Dashes overlay (runway marking) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, var(--blue) 0px, var(--blue) 12px, transparent 12px, transparent 22px)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

export default function Experience() {
  const { experience } = data;

  return (
    <section id="experience" className="relative px-6 py-28 overflow-hidden">
      {/* Landing zone atmospheric haze — warm glow at bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-40 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--blue-bright)" }}>
            02 — Experience
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-14 tracking-tight">
            Where I&apos;ve worked
          </h2>
        </FadeUp>

        <div className="relative">
          <RunwayLine />

          <StaggerContainer className="space-y-10 pl-9" staggerDelay={0.15}>
            {experience.map((job, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="relative group"
              >
                {/* Runway light dot (orange, pulsing) */}
                <div className="absolute -left-9 top-[22px] flex items-center justify-center">
                  <motion.div
                    className="absolute w-5 h-5 rounded-full"
                    style={{ background: "var(--orange)" }}
                    animate={{ scale: [1, 1.9, 1], opacity: [0, 0.18, 0] }}
                    transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.7, ease: "easeOut" }}
                  />
                  <div
                    className="relative w-2.5 h-2.5 rounded-full z-10 transition-all duration-300 group-hover:scale-125"
                    style={{
                      background: "var(--orange)",
                      boxShadow: "0 0 0 3px var(--bg), 0 0 10px rgba(255,127,17,0.5)",
                    }}
                  />
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="rounded-2xl p-6 border"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(10,78,158,0.48)";
                    el.style.boxShadow   = "0 0 30px rgba(10,78,158,0.16), 0 8px 32px rgba(0,0,0,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--border)";
                    el.style.boxShadow   = "0 2px 8px rgba(0,0,0,0.3)";
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-white leading-snug">
                        {job.role}
                      </h3>
                      <p className="text-sm mt-0.5 font-medium" style={{ color: "var(--orange)" }}>
                        {job.company}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono shrink-0 px-2.5 py-1 rounded-lg self-start"
                      style={{
                        color: "var(--blue-bright)",
                        background: "rgba(59,130,246,0.08)",
                        border: "1px solid rgba(59,130,246,0.18)",
                      }}
                    >
                      {job.date}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {job.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm" style={{ color: "var(--muted)" }}>
                        <span
                          className="mt-[7px] shrink-0 w-1 h-1 rounded-full"
                          style={{ background: "var(--blue-bright)", opacity: 0.65 }}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
