"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
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
    () =>
      active === ALL ? projects : projects.filter((p) => p.category === active),
    [projects, active, ALL]
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

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
        <div className="no-scrollbar mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setActive(c);
                if (isDesktop)
                  sectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2.5 text-sm transition-colors",
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

  if (projects.length === 0) {
    return (
      <section id="projects" ref={sectionRef} className="relative py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          {sectionHeader}
          <SectionReveal delay={0.15}>
            <div className="mt-12 glass rounded-2xl p-10 text-center text-ink-300">
              <p>{t("empty")}</p>
            </div>
          </SectionReveal>
        </div>
      </section>
    );
  }

  // ─── Mobile / tablet: regular grid ───────────────────────────────────────
  if (!isDesktop) {
    return (
      <section id="projects" ref={sectionRef} className="relative py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          {sectionHeader}
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
                          <Star className="h-3 w-3 text-accent-lime" />{" "}
                          {t("featured")}
                        </span>
                      )}
                      <span className="absolute right-3 top-3 chip bg-black/40 text-white">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg text-white">
                          {p.title}
                        </h3>
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                      </div>
                      <p className="mt-1 text-sm text-ink-300">{p.tagline}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.slice(0, 4).map((tech) => (
                          <span key={tech} className="chip">
                            {tech}
                          </span>
                        ))}
                        {p.tech.length > 4 && (
                          <span className="chip">
                            +{p.tech.length - 4}
                          </span>
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
        </div>
      </section>
    );
  }

  // ─── Desktop: sticky stacked cards with sticky side header ───────────────
  // Left column (4/12): the section header + filters, pinned via sticky top so
  // they stay visible while the user scrolls through the card stack.
  // Right column (8/12): each card wrapper is h-screen + position:sticky with
  // increasing top and z-index — they stack like cards being dealt onto a pile.
  return (
    <section id="projects" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-4">
            <div className="sticky top-24">{sectionHeader}</div>
          </aside>

          <div className="col-span-8">
            {filtered.map((project, i) => (
              <StackedCard
                key={project.id}
                project={project}
                index={i}
                featuredLabel={t("featured")}
                sourceAria={t("sourceAria", { title: project.title })}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedCard({
  project,
  index,
  featuredLabel,
  sourceAria,
}: {
  project: Project;
  index: number;
  featuredLabel: string;
  sourceAria: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scale and dim this card as the next one slides up over it — the depth cue
  // that makes it feel pushed back, not just hidden.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.85]);

  // Each card pins a few pixels lower than the previous so you see a thin edge
  // of the card(s) underneath — hint of "there's a stack behind this".
  const topOffset = 96 + index * 8;

  return (
    <div
      ref={ref}
      className="sticky flex h-[100dvh] items-center justify-center pb-[10vh]"
      style={{ top: `${topOffset}px`, zIndex: index + 1 }}
    >
      <motion.article
        style={{ scale, opacity }}
        className="group relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/40 transition-colors hover:border-white/20"
      >
        <a
          href={project.liveUrl || project.githubUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className="grid w-full md:grid-cols-2"
          style={{ height: "min(72vh, 720px)" }}
        >
          <div className="relative overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority={index === 0}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink-900/40" />
            {project.featured && (
              <span className="absolute left-4 top-4 chip bg-black/50 text-white backdrop-blur-sm">
                <Star className="h-3 w-3 text-accent-lime" /> {featuredLabel}
              </span>
            )}
            <span className="absolute right-4 top-4 chip bg-black/50 text-white backdrop-blur-sm">
              {project.category}
            </span>
          </div>

          <div className="flex flex-col justify-center gap-4 p-8 md:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl text-white md:text-3xl">
                {project.title}
              </h3>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
            <p className="text-ink-300">{project.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </a>

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={sourceAria}
            className="absolute bottom-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
      </motion.article>
    </div>
  );
}
