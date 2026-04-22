"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Project } from "@prisma/client";
import { SectionReveal } from "./SectionReveal";
import { cn } from "@/lib/utils";

export function Projects({ projects }: { projects: Project[] }) {
  const t = useTranslations("Projects");
  const ALL = t("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return [ALL, ...Array.from(set)];
  }, [projects, ALL]);

  const [active, setActive] = useState(ALL);
  const [isDesktop, setIsDesktop] = useState(false);

  const filtered = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [projects, active, ALL]
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    if (!isDesktop) return;
    const calculate = () => {
      if (!carouselRef.current) return;
      // w-max on the carousel div ensures scrollWidth = actual content width
      // (without it, flex-col stretch makes scrollWidth = clientWidth = 100vw)
      setScrollDistance(Math.max(0, carouselRef.current.scrollWidth - window.innerWidth));
    };
    const id = setTimeout(calculate, 60);
    window.addEventListener("resize", calculate);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", calculate);
    };
  }, [filtered, isDesktop]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  const sectionHeader = (
    <>
      <SectionReveal>
        <span className="label-muted">{t("eyebrow")}</span>
        <h2 className="section-heading mt-3 max-w-3xl">
          {t("titleA")}
          <span className="text-gradient-accent">{t("titleAccent")}</span>
          {t("titleB")}
        </h2>
      </SectionReveal>
      <SectionReveal delay={0.1}>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setActive(c);
                if (isDesktop) sectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-all",
                active === c
                  ? "border-accent bg-accent/15 text-white shadow-glow"
                  : "border-white/10 bg-white/5 text-ink-200 hover:border-white/20 hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </SectionReveal>
    </>
  );

  // ─── Mobile / empty state ────────────────────────────────────────────────────
  if (!isDesktop || projects.length === 0) {
    return (
      <section id="projects" className="relative py-24 sm:py-32">
        <div className="container-page">
          {sectionHeader}
          {projects.length === 0 ? (
            <SectionReveal delay={0.15}>
              <div className="mt-12 glass rounded-2xl p-10 text-center text-ink-300">
                <p>{t("empty")}</p>
              </div>
            </SectionReveal>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] card-hover"
                  >
                    <a
                      href={p.liveUrl || p.githubUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                        {p.featured && (
                          <span className="absolute left-3 top-3 chip bg-black/40 text-white">
                            <Star className="h-3 w-3 text-accent-lime" /> {t("featured")}
                          </span>
                        )}
                        <span className="absolute right-3 top-3 chip bg-black/40 text-white">
                          {p.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg text-white">{p.title}</h3>
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                        </div>
                        <p className="mt-1 text-sm text-ink-300">{p.tagline}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.tech.slice(0, 4).map((tech) => (
                            <span key={tech} className="chip text-[11px]">{tech}</span>
                          ))}
                          {p.tech.length > 4 && (
                            <span className="chip text-[11px]">+{p.tech.length - 4}</span>
                          )}
                        </div>
                      </div>
                    </a>
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t("sourceAria", { title: p.title })}
                        className="absolute bottom-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── Desktop: scroll-driven horizontal carousel ──────────────────────────────
  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${scrollDistance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden py-14">
        <div className="container-page shrink-0">
          {sectionHeader}
        </div>

        {/*
          w-max is critical: makes the div exactly as wide as its content so that
          scrollWidth = clientWidth = total cards width, giving the correct scrollDistance.
          Without it, flex-col stretch sets width = 100vw → scrollDistance ≈ 0.
        */}
        <motion.div
          ref={carouselRef}
          style={{
            x,
            paddingLeft: "max(1.25rem, calc((100vw - 72rem) / 2 + 1.25rem))",
            paddingRight: "5rem",
          }}
          className="mt-6 flex w-max shrink-0 items-stretch gap-6"
        >
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              // 1/3 of viewport width, portrait-oriented height filling most of the screen
              className="group relative flex w-[33vw] min-w-[260px] max-w-[460px] shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] card-hover"
              style={{ height: "clamp(380px, calc(100vh - 290px), 680px)" }}
            >
              <a
                href={p.liveUrl || p.githubUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col"
              >
                {/* Image fills all available space */}
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                  {p.featured && (
                    <span className="absolute left-3 top-3 chip bg-black/40 text-white">
                      <Star className="h-3 w-3 text-accent-lime" /> {t("featured")}
                    </span>
                  )}
                  <span className="absolute right-3 top-3 chip bg-black/40 text-white">
                    {p.category}
                  </span>
                </div>
                {/* Fixed text area at the bottom */}
                <div className="shrink-0 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg text-white">{p.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                  <p className="mt-1 text-sm text-ink-300">{p.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((tech) => (
                      <span key={tech} className="chip text-[11px]">{tech}</span>
                    ))}
                    {p.tech.length > 4 && (
                      <span className="chip text-[11px]">+{p.tech.length - 4}</span>
                    )}
                  </div>
                </div>
              </a>
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("sourceAria", { title: p.title })}
                  className="absolute bottom-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
