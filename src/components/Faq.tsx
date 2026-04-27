import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";

type FaqItem = { q: string; a: string };

export async function Faq() {
  const t = await getTranslations("Faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <span className="label-muted">{t("eyebrow")}</span>
          <h2 className="section-heading mt-3">
            {t("titleA")}
            {t("titleAccent")}
            {t("titleB")}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-12 mx-auto max-w-3xl space-y-3">
            {items.map((item, i) => (
              <li key={item.q}>
                <details
                  className="faq-item overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 open:border-accent/40 open:bg-white/[0.04]"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5">
                    <span className="font-display text-base text-white sm:text-lg">
                      {item.q}
                    </span>
                    <Plus className="faq-icon h-5 w-5 shrink-0 text-accent-cyan" aria-hidden />
                  </summary>
                  <div className="faq-body-wrap">
                    <div className="faq-body-inner">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-200 sm:px-6 sm:pb-6">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
