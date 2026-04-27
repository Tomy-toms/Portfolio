"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

export function Pricing() {
  const t = useTranslations("Pricing");

  return (
    <section className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-14">
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-accent-cyan/10 blur-3xl"
              aria-hidden
            />

            <div className="relative max-w-3xl">
              <span className="label-muted">{t("eyebrow")}</span>
              <h2 className="section-heading mt-3">
                {t("titleA")}
                <span className="text-gradient-accent">{t("titleAccent")}</span>
                {t("titleB")}
              </h2>
              <p className="mt-6 text-lg text-ink-200 leading-relaxed">
                {t("paragraph1")}
              </p>
              <p className="mt-4 text-ink-300 leading-relaxed">
                {t("paragraph2")}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-8 flex items-center gap-3 rounded-2xl border border-accent-lime/30 bg-accent-lime/5 p-4 text-sm text-ink-100"
              >
                <ShieldCheck className="h-5 w-5 shrink-0 text-accent-lime" />
                <span>{t("promise")}</span>
              </motion.div>

              <a href="#contact" className="btn-primary mt-10 inline-flex">
                {t("cta")} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
