"use client";

import { motion } from "framer-motion";
import { Award, Code2, Rocket, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

const STAT_KEYS = [
  { key: "years", icon: Code2 },
  { key: "projects", icon: Rocket },
  { key: "clients", icon: Users },
  { key: "response", icon: Award },
] as const;

export function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionReveal className="lg:col-span-5">
            <span className="label-muted">{t("eyebrow")}</span>
            <h2 className="section-heading mt-3">
              {t("titleA")}
              <span className="text-gradient-accent">{t("titleAccent")}</span>
              {t("titleB")}
            </h2>
            <p className="mt-6 text-ink-200 leading-relaxed">{t("bio")}</p>
            <p className="mt-4 text-ink-300 leading-relaxed">{t("paragraph2")}</p>
          </SectionReveal>

          <SectionReveal delay={0.1} className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {STAT_KEYS.map((s, i) => (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="glass card-hover rounded-2xl p-6"
                >
                  <s.icon className="h-5 w-5 text-accent-cyan" />
                  <div className="mt-6 font-display text-4xl sm:text-5xl text-gradient">
                    {t(`stats.${s.key}.value`)}
                  </div>
                  <div className="mt-1 text-sm text-ink-300">
                    {t(`stats.${s.key}.label`)}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 glass rounded-2xl p-6 text-sm text-ink-200">
              <p className="text-ink-300">{t("focusEyebrow")}</p>
              <p className="mt-2">{t("focus")}</p>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
