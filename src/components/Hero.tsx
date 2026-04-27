"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Github, Linkedin, MapPin } from "lucide-react";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

export function Hero() {
  const t = useTranslations("Hero");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-52 sm:pb-32"
      aria-label="Intro"
    >
      <motion.div style={{ y, opacity }} className="container-page">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chip"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-lime" />
          </span>
          {t("availability")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-6 font-display text-[clamp(2.5rem,10vw,3rem)] sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight"
        >
          <span className="block text-ink-100">{t("titleLine1")}</span>
          <span className="block text-gradient-accent">{t("titleLine2")}</span>
          <span className="block text-ink-100">{t("titleLine3")}</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.6 }}
          className="mt-4 text-xs font-medium uppercase tracking-widest text-ink-400"
        >
          {t("subtitle")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200"
        >
          {t.rich("intro", {
            b: (chunks) => <span className="text-white">{chunks}</span>,
          })}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a href="#contact" className="btn-primary">
            {t("ctaContact")} <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#projects" className="btn-ghost">
            {t("ctaWork")}
          </a>
          <div className="ml-1 flex items-center gap-1">
            <a
              href={site.social.github}
              target="_blank"
              rel="noreferrer"
              aria-label={t("githubAria")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/10"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={t("linkedinAria")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-white/10"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 flex flex-wrap items-center gap-4 text-sm text-ink-300"
        >
          <MapPin className="h-4 w-4" />
          <span>{t("trust1")}</span>
          <span className="h-1 w-1 rounded-full bg-ink-500" />
          <span>{t("trust2")}</span>
          <span className="h-1 w-1 rounded-full bg-ink-500" />
          <span>{t("trust3")}</span>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-24 bg-gradient-to-b from-transparent to-ink-950" />
    </section>
  );
}
