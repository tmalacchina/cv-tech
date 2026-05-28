"use client";

import { FadeUp } from "./AnimatedSection";

export default function Footer() {
  const personal_info = { name: "", email: "", phone: "", location: "" };

  return (
    <footer id="contact" className="px-6 py-20 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: "var(--blue-bright)" }}>
            Let&apos;s work together
          </p>
          <a
            href={`mailto:${personal_info.email}`}
            className="group inline-block text-xl sm:text-3xl font-semibold text-white tracking-tight mb-2 transition-all duration-200"
            style={{ textDecorationColor: "var(--orange)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#FF7F11";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
          >
            {personal_info.email}
          </a>
          <p className="text-sm text-zinc-600">{personal_info.phone}</p>
        </FadeUp>

        <div
          className="mt-16 pt-6 border-t flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs text-zinc-700 font-mono">
            {new Date().getFullYear()} · {personal_info.name} · Built with Next.js
          </span>
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--orange)" }}
          />
        </div>
      </div>
    </footer>
  );
}
