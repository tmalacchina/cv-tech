"use client";

import { FadeUp } from "./AnimatedSection";

export default function About() {
  const education: { degree: string; school: string; date: string }[] = [];
  const languages: { language: string; level: string }[] = [];
  const highlights_and_soft_skills: string[] = [];

  return (
    <section className="px-6 py-28 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--blue-bright)" }}>
            04 — Background
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-14 tracking-tight">
            The full picture
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Education */}
          <FadeUp delay={0.05}>
            <div
              className="rounded-xl p-6 border h-full"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: "var(--blue-bright)" }}>
                Education
              </h3>
              <div className="space-y-5">
                {education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-white leading-snug mb-1">
                      {edu.degree}
                    </p>
                    <p className="text-xs text-zinc-500 mb-0.5">{edu.school}</p>
                    <p className="text-xs font-mono" style={{ color: "rgba(26,111,219,0.7)" }}>{edu.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Languages */}
          <FadeUp delay={0.1}>
            <div
              className="rounded-xl p-6 border h-full"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: "var(--blue-bright)" }}>
                Languages
              </h3>
              <div className="space-y-4">
                {languages.map((lang, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-white">{lang.language}</span>
                    <span className="text-xs text-zinc-500 text-right leading-relaxed max-w-[130px]">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Highlights */}
          <FadeUp delay={0.15}>
            <div
              className="rounded-xl p-6 border h-full"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="text-xs font-mono tracking-widest uppercase mb-5" style={{ color: "var(--blue-bright)" }}>
                Highlights
              </h3>
              <ul className="space-y-3.5">
                {highlights_and_soft_skills.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <span
                      className="mt-1.5 shrink-0 w-1 h-1 rounded-full"
                      style={{ background: "var(--orange)", opacity: 0.8 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
