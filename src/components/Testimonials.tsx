"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
};

export function Testimonials() {
  const t = useTranslations("Testimonials");
  const items = t.raw("items") as TestimonialItem[];

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
        </SectionReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >
              <Quote className="h-8 w-8 text-accent-cyan/60" aria-hidden />
              <blockquote className="mt-4 text-ink-100 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-cyan font-display text-sm font-semibold text-white">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display text-sm text-white">
                    {item.name}
                  </div>
                  <div className="text-xs text-ink-400">{item.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
