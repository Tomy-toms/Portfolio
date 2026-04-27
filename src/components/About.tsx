"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "./SectionReveal";

export function About() {
  const t = useTranslations("About");

  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <SectionReveal className="max-w-3xl">
          <span className="label-muted">{t("eyebrow")}</span>
          <h2 className="section-heading mt-3">
            {t("titleA")}
            {t("titleAccent")}
            {t("titleB")}
          </h2>
          <p className="mt-6 text-ink-200 leading-relaxed">{t("bio")}</p>
          <p className="mt-4 text-ink-300 leading-relaxed">{t("paragraph2")}</p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-10 glass rounded-2xl p-6 max-w-3xl text-sm text-ink-200">
            <p className="text-ink-300">{t("focusEyebrow")}</p>
            <p className="mt-2">{t("focus")}</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
