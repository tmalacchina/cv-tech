"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { ScrollContext } from "./ScrollContext";
import Nav from "./Nav";
import HeroSky from "./HeroSky";
import SurfaceExperience from "./SurfaceExperience";
import UndergroundTech from "./UndergroundTech";
import About from "./About";
import Footer from "./Footer";
import ScrollIndicator from "./RocketGuide";

/*
 * Global background colour journey (sky → surface → underground):
 *
 *   0%   →  #020617   deep space / upper sky
 *  22%   →  #0F172A   lower sky / surface approach
 *  44%   →  #0a0f1a   ground / dusk
 *  68%   →  #040608   underground entry
 * 100%   →  #000000   core
 */
const STOPS  = [0, 0.22, 0.44, 0.68, 1.0] as const;
const COLORS = ["#020617", "#0F172A", "#0a0f1a", "#040608", "#000000"];

export default function PageClient() {
  const { scrollYProgress } = useScroll();
  const bgColor = useTransform(scrollYProgress, [...STOPS], COLORS);

  return (
    <ScrollContext.Provider value={{ scrollYProgress }}>
      {/* Animated background — behind everything */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: bgColor }}
        aria-hidden
      />

      <ScrollIndicator />

      <main className="relative z-10">
        <Nav />

        {/* Layer 1 — Sky */}
        <HeroSky />

        {/* Layer 2 — Surface */}
        <SurfaceExperience />

        {/* Layer 3 — Underground */}
        <UndergroundTech />

        {/* Epilogue */}
        <About />
        <Footer />
      </main>
    </ScrollContext.Provider>
  );
}
