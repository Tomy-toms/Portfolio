import { ArrowRight, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export async function Pricing() {
  const t = await getTranslations("Pricing");

  return (
    <section className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-14">
            {/* Decorative accents — radial gradients are cheaper to paint than blur-3xl. */}
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(139,92,246,0.18), transparent 70%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(34,211,238,0.18), transparent 70%)",
              }}
              aria-hidden
            />

            <div className="relative max-w-3xl">
              <SectionHeader
                eyebrow={t("eyebrow")}
                titleA={t("titleA")}
                titleAccent={t("titleAccent")}
                titleB={t("titleB")}
                accent
                intro={t("paragraph1")}
                introClassName="text-lg text-ink-200 leading-relaxed"
              />
              <p className="mt-4 text-ink-300 leading-relaxed">
                {t("paragraph2")}
              </p>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-accent-lime/30 bg-accent-lime/5 p-4 text-sm text-ink-100">
                <ShieldCheck className="h-5 w-5 shrink-0 text-accent-lime" />
                <span>{t("promise")}</span>
              </div>

              <a href="#contact" className="btn-primary mt-10 inline-flex">
                {t("cta")} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
