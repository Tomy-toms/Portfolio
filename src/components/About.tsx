"use client";

import { motion } from "framer-motion";
import { Award, Code2, Rocket, Users } from "lucide-react";
import { site } from "@/lib/site";
import { SectionReveal } from "./SectionReveal";

const stats = [
  { label: "Years coding", value: "7+", icon: Code2 },
  { label: "Shipped projects", value: "40+", icon: Rocket },
  { label: "Happy clients", value: "20+", icon: Users },
  { label: "Awwwards nods", value: "3", icon: Award },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionReveal className="lg:col-span-5">
            <span className="label-muted">01 — About</span>
            <h2 className="section-heading mt-3">
              A developer with a <span className="text-gradient-accent">designer’s eye</span>.
            </h2>
            <p className="mt-6 text-ink-200 leading-relaxed">{site.bio}</p>
            <p className="mt-4 text-ink-300 leading-relaxed">
              I partner with founders, agencies, and product teams to turn
              ambitious ideas into fast, accessible, and beautiful web apps.
              I care just as much about a 96 Lighthouse score as I do about a
              button that feels just right.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1} className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="glass card-hover rounded-2xl p-6"
                >
                  <s.icon className="h-5 w-5 text-accent-cyan" />
                  <div className="mt-6 font-display text-4xl sm:text-5xl text-gradient">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-ink-300">{s.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 glass rounded-2xl p-6 text-sm text-ink-200">
              <p className="text-ink-300">
                Current focus —
              </p>
              <p className="mt-2">
                Cinematic marketing sites, AI-native dashboards, and developer
                tooling. Currently experimenting with WebGPU shaders and
                real-time collab primitives.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
