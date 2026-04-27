import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";

export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <span className="label-muted">{t("eyebrow")}</span>
          <h2 className="section-heading mt-3">
            {t("titleA")}
            {t("titleAccent")}
            {t("titleB")}
          </h2>
          <p className="mt-6 text-ink-200 leading-relaxed">{t("bio")}</p>
          <p className="mt-4 text-ink-300 leading-relaxed">{t("paragraph2")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 glass rounded-2xl p-6 max-w-3xl text-sm text-ink-200">
            <p className="text-ink-300">{t("focusEyebrow")}</p>
            <p className="mt-2">{t("focus")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
