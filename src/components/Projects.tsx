"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Github, Sparkles, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Project } from "@prisma/client";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
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

  const filtered = useMemo(
    () =>
      active === ALL ? projects : projects.filter((p) => p.category === active),
    [projects, active, ALL]
  );

  const sectionRef = useRef<HTMLElement>(null);

  const sectionHeader = (
    <>
      <Reveal>
        <SectionHeader
          eyebrow={t("eyebrow")}
          titleA={t("titleA")}
          titleAccent={t("titleAccent")}
          titleB={t("titleB")}
          accent
          headingClassName="max-w-3xl"
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div
          role="group"
          aria-label={t("filterAria")}
          className="no-scrollbar mt-6 -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={active === c}
              onClick={() => {
                setActive(c);
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
      </Reveal>
    </>
  );

  if (projects.length === 0) {
    return (
      <section
        id="projects"
        ref={sectionRef}
        className="relative py-16 sm:py-24 lg:py-32"
      >
        <div className="container-page">
          {sectionHeader}
          <Reveal delay={0.15}>
            <div className="mt-12 glass rounded-2xl px-10 py-14 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <Sparkles className="h-6 w-6 text-accent" aria-hidden />
              </div>
              <p className="font-display text-xl text-white sm:text-2xl">
                {t("emptyTitle")}
              </p>
              <p className="mt-3 max-w-md mx-auto text-ink-300">
                {t("empty")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  // ─── Sticky stacked cards (mobile + desktop) ────────────────────────────
  // Mobile: section header in normal flow at the top, then cards stack
  //         beneath it, each pinning ~80 px from the top of the viewport.
  // Desktop (lg+): the header becomes a sticky aside on the left (4/12),
  //         cards stack in the right column (8/12), pinning at ~96 px.
  // Each card wrapper is h-[100dvh] + position: sticky with an increasing top
  // and z-index — they stack like cards being dealt onto a pile.
  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32"
    >
      <div className="container-page">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">{sectionHeader}</div>
          </aside>

          <div className="mt-10 lg:col-span-8 lg:mt-0">
            {filtered.map((project, i) => (
              <div
                key={project.id}
                className="sticky flex h-[100dvh] items-center justify-center pb-[10vh]"
                style={{
                  // Pin at ~80 px on mobile, ~96 px on desktop. The +i*8 offset
                  // ensures each card peeks under the next on the stack.
                  top: `calc(clamp(80px, 6vw, 96px) + ${i * 8}px)`,
                  zIndex: i + 1,
                }}
              >
                <article
                  aria-labelledby={`project-${project.id}-title`}
                  className="group relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/40 transition-colors hover:border-white/20"
                >
                  <div
                    className="grid w-full grid-rows-[14rem_1fr] sm:grid-rows-[16rem_1fr] md:grid-rows-1 md:grid-cols-2"
                    style={{ height: "min(80vh, 720px)" }}
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink-900/40"
                      />
                      {project.featured && (
                        <span className="absolute left-3 top-3 chip bg-black/60 text-white sm:left-4 sm:top-4">
                          <Star className="h-3 w-3 text-accent-lime" aria-hidden />{" "}
                          {t("featured")}
                        </span>
                      )}
                      <span className="absolute right-3 top-3 chip bg-black/60 text-white sm:right-4 sm:top-4">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center gap-3 overflow-hidden p-6 sm:gap-4 sm:p-8 md:p-10 lg:p-12">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          id={`project-${project.id}-title`}
                          className="font-display text-xl text-white sm:text-2xl md:text-3xl"
                        >
                          {project.title}
                        </h3>
                        <ArrowUpRight
                          aria-hidden
                          className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white sm:h-6 sm:w-6"
                        />
                      </div>
                      <p className="text-sm text-ink-300 sm:text-base">
                        {project.tagline}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5 sm:mt-2">
                        {project.tech.map((tech) => (
                          <span key={tech} className="chip">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 sm:mt-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t("liveAria", { title: project.title })}
                            className="btn-primary"
                          >
                            {t("viewSite")}
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t("sourceAria", { title: project.title })}
                            className="btn-ghost"
                          >
                            <Github className="h-4 w-4" aria-hidden />
                            {t("source")}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
