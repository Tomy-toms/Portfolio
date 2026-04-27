import { Briefcase } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
};

export async function Experience() {
  const t = await getTranslations("Experience");
  const items = t.raw("items") as ExperienceItem[];

  return (
    <section id="experience" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <Reveal>
          <span className="label-muted">{t("eyebrow")}</span>
          <h2 className="section-heading mt-3 max-w-3xl">
            {t("titleA")}
            {t("titleAccent")}
            {t("titleB")}
          </h2>
        </Reveal>

        <ol className="relative mt-14 border-l border-white/10 pl-8 sm:pl-10">
          {items.map((item, i) => (
            <Reveal
              key={item.role + item.company}
              as="li"
              delay={i * 0.08}
              className="relative mb-10 last:mb-0"
            >
              <span className="absolute -left-[42px] sm:-left-[50px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-cyan text-white shadow-glow">
                <Briefcase className="h-4 w-4" />
              </span>
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl text-white">
                    {item.role}
                    <span className="text-ink-300"> · {item.company}</span>
                  </h3>
                  <span className="font-mono text-xs text-ink-400">
                    {item.period}
                  </span>
                </div>
                <div className="mt-1 text-sm text-ink-400">{item.location}</div>
                <ul className="mt-4 space-y-2 text-sm text-ink-200">
                  {item.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
