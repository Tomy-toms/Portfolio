import { ArrowRight, Github, Linkedin, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-52 sm:pb-32"
      aria-label="Intro"
    >
      <div className="container-page">
        <span className="hero-fade chip" style={{ ["--hero-delay" as string]: "0.1s" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-lime" />
          </span>
          {t("availability")}
        </span>

        <h1
          className="hero-fade mt-6 font-display text-[clamp(2.5rem,10vw,3rem)] sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight"
          style={{ ["--hero-delay" as string]: "0.15s" }}
        >
          <span className="block text-ink-100">{t("titleLine1")}</span>
          <span className="block text-gradient-accent">{t("titleLine2")}</span>
          <span className="block text-ink-100">{t("titleLine3")}</span>
        </h1>

        <h2
          className="hero-fade mt-4 text-xs font-medium uppercase tracking-widest text-ink-400"
          style={{ ["--hero-delay" as string]: "0.22s" }}
        >
          {t("subtitle")}
        </h2>

        <p
          className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-ink-200"
          style={{ ["--hero-delay" as string]: "0.3s" }}
        >
          {t.rich("intro", {
            b: (chunks) => <span className="text-white">{chunks}</span>,
          })}
        </p>

        <div
          className="hero-fade mt-10 flex flex-wrap items-center gap-3"
          style={{ ["--hero-delay" as string]: "0.4s" }}
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
        </div>

        <div
          className="hero-fade mt-16 flex flex-wrap items-center gap-4 text-sm text-ink-300"
          style={{ ["--hero-delay" as string]: "0.55s" }}
        >
          <MapPin className="h-4 w-4" />
          <span>{t("trust1")}</span>
          <span className="h-1 w-1 rounded-full bg-ink-500" />
          <span>{t("trust2")}</span>
          <span className="h-1 w-1 rounded-full bg-ink-500" />
          <span>{t("trust3")}</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-24 bg-gradient-to-b from-transparent to-ink-950" />
    </section>
  );
}
