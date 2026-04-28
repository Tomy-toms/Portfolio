import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { LegalSection } from "@/components/LegalContent";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return {
    title: t("title"),
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Legal");
  const lastUpdate = t("lastUpdate", {
    date: new Date(site.legal.lastUpdated).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  });

  const sections = [
    { key: "editor", body: t("editor.body", { email: site.email }) },
    { key: "hosting", body: t("hosting.body") },
    { key: "ip", body: t("ip.body") },
    { key: "liability", body: t("liability.body") },
    { key: "law", body: t("law.body") },
    { key: "contact", body: t("contact.body", { email: site.email }) },
  ] as const;

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 scroll-mt-24 outline-none">
        <div className="container-page max-w-3xl">
          <header>
            <span className="label-muted">Legal</span>
            <h1 className="section-heading mt-3">{t("title")}</h1>
            <p className="mt-4 text-sm text-ink-300">{lastUpdate}</p>
          </header>

          <div className="mt-12">
            {sections.map((s) => (
              <LegalSection
                key={s.key}
                title={t(`${s.key}.title` as "editor.title")}
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
