"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: -9999, y: -9999 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      if (glowRef.current) {
        const { x, y } = posRef.current;
        glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,127,17,0.07) 0%, transparent 60%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-none"
    />
  );
}
