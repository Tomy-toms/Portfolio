"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.4, 0.8, 0.4], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent/25 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.3, 0.7, 0.3], x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-10%] top-[30%] h-[480px] w-[480px] rounded-full bg-accent-cyan/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.2, 0.45, 0.2], x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[30%] bottom-[-20%] h-[460px] w-[460px] rounded-full bg-accent-pink/15 blur-3xl"
      />
      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
