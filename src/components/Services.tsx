"use client";

import { motion } from "framer-motion";
import { Check, Globe, RefreshCw, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

type ServiceItem = {
  badge: string;
  title: string;
  description: string;
  features: string[];
  for: string;
};

const ICONS = [Globe, RefreshCw, ShoppingBag];

export function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as ServiceItem[];
  const includesList = t.raw("includesList") as string[];

  return (
    <section id="services" className="relative py-16 sm:py-24 lg:py-32">
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

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Globe;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                {item.badge && (
                  <span className="absolute -top-3 left-8 chip bg-accent text-white">
                    {item.badge}
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-cyan/20 text-accent-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-ink-300 leading-relaxed">
                  {item.description}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-ink-200">
                  {item.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-lime" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-xs italic text-ink-400">
                  {item.for}
                </p>
              </motion.article>
            );
          })}
        </div>

        <SectionReveal delay={0.1}>
          <div className="mt-10 glass rounded-2xl p-6 sm:p-8">
            <div className="label-muted">{t("includes")}</div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {includesList.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-ink-200"
                >
                  <Check className="h-4 w-4 shrink-0 text-accent-cyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
