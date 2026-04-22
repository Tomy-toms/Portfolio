import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { LegalSection } from "@/components/LegalContent";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return {
    title: t("title"),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Privacy");
  const lastUpdate = t("lastUpdate", {
    date: new Date("2026-04-22").toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  });

  const sections = [
    { key: "intro", body: t("intro.body") },
    { key: "controller", body: t("controller.body", { email: site.email }) },
    { key: "data", body: t("data.body") },
    { key: "purpose", body: t("purpose.body") },
    { key: "legalBasis", body: t("legalBasis.body") },
    { key: "retention", body: t("retention.body") },
    { key: "recipients", body: t("recipients.body") },
    { key: "rights", body: t("rights.body", { email: site.email }) },
    { key: "cookies", body: t("cookies.body") },
    { key: "complaint", body: t("complaint.body") },
  ] as const;

  return (
    <>
      <AnimatedBackground />
      <ScrollProgress />
      <Nav />
      <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container-page max-w-3xl">
          <header>
            <span className="label-muted">RGPD</span>
            <h1 className="section-heading mt-3">{t("title")}</h1>
            <p className="mt-4 text-sm text-ink-400">{lastUpdate}</p>
          </header>

          <div className="mt-12">
            {sections.map((s) => (
              <LegalSection
                key={s.key}
                title={t(`${s.key}.title` as "intro.title")}
                body={s.body}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
