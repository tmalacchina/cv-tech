"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

interface ScrollCtx {
  scrollYProgress: MotionValue<number>;
}

export const ScrollContext = createContext<ScrollCtx | null>(null);

export function useScrollProgress(): MotionValue<number> {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollProgress must be used inside PageClient");
  return ctx.scrollYProgress;
}
