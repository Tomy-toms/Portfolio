"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { SectionReveal } from "./SectionReveal";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionReveal className="lg:col-span-4">
            <span className="label-muted">03 — Toolbox</span>
            <h2 className="section-heading mt-3">
              The <span className="text-gradient-accent">stack</span> I reach for.
            </h2>
            <p className="mt-6 text-ink-300">
              Ten years of opinions distilled into the tools that make me
              ship faster without compromising craft.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1} className="lg:col-span-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {site.skills.map((s, i) => (
                <li
                  key={s.name}
                  className="glass card-hover rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-white">{s.name}</div>
                      <div className="text-[11px] uppercase tracking-wider text-ink-400">
                        {s.group}
                      </div>
                    </div>
                    <span className="font-mono text-sm text-ink-300">
                      {s.level}%
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 1.1,
                        delay: 0.05 * i,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-accent via-accent-cyan to-accent-pink"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
