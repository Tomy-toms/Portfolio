"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

type Stat = { value: string; label: string; source: string };

export function WhyWebsite() {
  const t = useTranslations("WhyWebsite");
  const stats = t.raw("stats") as Stat[];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-page">
        <SectionReveal className="max-w-3xl">
          <span className="label-muted">{t("eyebrow")}</span>
          <h2 className="section-heading mt-3">
            {t("titleA")}
            <span className="text-gradient-accent">{t("titleAccent")}</span>
            {t("titleB")}
          </h2>
          <p className="mt-6 text-ink-300">{t("intro")}</p>
        </SectionReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
              <div className="font-display text-5xl sm:text-6xl font-semibold text-gradient">
                {s.value}
              </div>
              <p className="mt-4 text-sm text-ink-200 leading-relaxed">
                {s.label}
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-wider text-ink-400">
                {s.source}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
