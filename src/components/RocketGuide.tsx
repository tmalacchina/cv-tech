"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useScrollProgress } from "./ScrollContext";

/*
 * Minimal scroll indicator — fixed left edge:
 *  • 1px very-dark vertical track
 *  • 20px orange segment that slides along the track
 * Zero React state, pure MotionValues.
 */

const TRACK_H   = 200;   // px — total track height
const SEGMENT_H = 20;    // px — orange travelling segment

export default function ScrollIndicator() {
  const scrollYProgress = useScrollProgress();

  /* Segment travels from 0 → TRACK_H - SEGMENT_H */
  const rawY  = useTransform(scrollYProgress, [0, 1], [0, TRACK_H - SEGMENT_H]);
  const segY  = useSpring(rawY, { stiffness: 130, damping: 28, mass: 0.6 });

  /* Fade in after first scroll, fade out near bottom */
  const opacity = useTransform(scrollYProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      aria-hidden
      className="fixed left-5 top-1/2 -translate-y-1/2 z-50 hidden sm:block pointer-events-none"
      style={{ height: TRACK_H, opacity }}
    >
      {/* Track line */}
      <div
        className="absolute"
        style={{
          left: 1,          // centres the 1px line under the 3px dot column
          top: 0,
          bottom: 0,
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
        }}
      />

      {/* Travelling 20px orange segment */}
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 3,
          height: SEGMENT_H,
          borderRadius: 2,
          y: segY,
          background: "#FF7F11",
          boxShadow: "0 0 8px 2px rgba(255,127,17,0.65), 0 0 20px 4px rgba(255,127,17,0.28)",
        }}
      />
    </motion.div>
  );
}
