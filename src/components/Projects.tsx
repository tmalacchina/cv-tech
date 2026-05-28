// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { FadeUp, StaggerContainer, staggerItem } from "./AnimatedSection";
import data from "@/data/data.json";

export default function Projects() {
  const { projects } = data;

  return (
    <section id="projects" className="relative px-6 py-28 overflow-hidden">

      {/* ── Underground magma light sources ─────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Central magma vent */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px]"
          style={{
            background: "radial-gradient(ellipse at center bottom, rgba(255,100,0,0.14) 0%, rgba(255,127,17,0.06) 35%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        {/* Left crack */}
        <div
          className="absolute bottom-0 left-[10%] w-[300px] h-[240px]"
          style={{
            background: "radial-gradient(ellipse at center bottom, rgba(255,80,0,0.1) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        {/* Right crack */}
        <div
          className="absolute bottom-0 right-[8%] w-[240px] h-[200px]"
          style={{
            background: "radial-gradient(ellipse at center bottom, rgba(255,140,0,0.09) 0%, transparent 65%)",
            filter: "blur(28px)",
          }}
        />
        {/* Geological top separator — dark rock face */}
        <div
          className="absolute top-0 left-0 right-0 h-20"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "#e08030" }}>
            03 — Projects
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-14 tracking-tight">
            Things I&apos;ve built
          </h2>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.a
              key={i}
              href={project.link}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.018 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: "spring", stiffness: 310, damping: 20 }}
              className="group relative flex flex-col justify-between p-7 rounded-2xl overflow-hidden"
              style={{
                /* Excavation / buried capsule base */
                background: "linear-gradient(180deg, #0d0a06 0%, #090704 100%)",
                border: "1px solid rgba(180,80,0,0.2)",
                boxShadow:
                  "inset 0 -50px 80px rgba(255,100,0,0.07), " +
                  "0 2px 12px rgba(0,0,0,0.6)",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,127,17,0.42)";
                el.style.boxShadow =
                  "inset 0 -70px 100px rgba(255,100,0,0.14), " +
                  "inset 0 0 40px rgba(255,127,17,0.04), " +
                  "0 0 40px rgba(255,100,0,0.16), " +
                  "0 0 0 1px rgba(255,127,17,0.22), " +
                  "0 20px 50px rgba(0,0,0,0.7)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(180,80,0,0.2)";
                el.style.boxShadow =
                  "inset 0 -50px 80px rgba(255,100,0,0.07), " +
                  "0 2px 12px rgba(0,0,0,0.6)";
              }}
            >
              {/* Magma light leak from bottom */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, rgba(255,80,0,0.12) 0%, transparent 100%)",
                }}
              />

              {/* Rock texture crack (thin line at top) */}
              <div
                aria-hidden
                className="absolute top-0 left-8 right-8 h-px"
                style={{
                  background: "linear-gradient(to right, transparent, rgba(255,127,17,0.25), transparent)",
                }}
              />

              {/* Corner excavation arrow */}
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-250 translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF7F11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </div>

              <div>
                {/* Capsule marker */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#FF7F11", boxShadow: "0 0 6px rgba(255,127,17,0.8)" }}
                  />
                  <span className="text-xs font-mono" style={{ color: "#e08030" }}>
                    LAYER-0{i + 1}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-3 leading-snug pr-6">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a6070" }}>
                  {project.description}
                </p>
              </div>

              <div
                className="mt-7 pt-5 flex items-center justify-between border-t"
                style={{ borderColor: "rgba(180,80,0,0.18)" }}
              >
                <span
                  className="text-xs font-mono transition-colors duration-200 group-hover:text-[#FF7F11]"
                  style={{ color: "#3a2a1a" }}
                >
                  Excavate →
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{
                    background: "rgba(255,127,17,0.12)",
                    border: "1px solid rgba(255,127,17,0.3)",
                    boxShadow: "0 0 12px rgba(255,127,17,0.25)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF7F11" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
