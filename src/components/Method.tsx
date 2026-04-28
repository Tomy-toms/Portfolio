import { MessageCircle, PenLine, Code2, Rocket } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { MethodStepsSchema } from "@/lib/i18n-schemas";

const ICONS = [MessageCircle, PenLine, Code2, Rocket];

export async function Method() {
  const t = await getTranslations("Method");
  const steps = MethodStepsSchema.parse(t.raw("steps"));

  return (
    <section id="method" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <SectionHeader
            eyebrow={t("eyebrow")}
            titleA={t("titleA")}
            titleAccent={t("titleAccent")}
            titleB={t("titleB")}
            accent
            intro={t("intro")}
          />
        </Reveal>

        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-accent via-accent-cyan to-transparent md:block"
            aria-hidden
          />
          <ol className="grid gap-5 md:grid-cols-2">
            {steps.map((step, i) => {
              const Icon = ICONS[i] ?? MessageCircle;
              return (
                <Reveal
                  key={step.number}
                  as="li"
                  delay={i * 0.1}
                  className="glass card-hover rounded-3xl p-6 sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-cyan text-white shadow-glow">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-xs text-ink-400">
                          {step.number}
                        </span>
                        <h3 className="font-display text-xl text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-wider text-accent-cyan">
                        {step.duration}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-ink-200 leading-relaxed">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
