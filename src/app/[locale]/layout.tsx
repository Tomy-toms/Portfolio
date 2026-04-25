import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const base = site.url;

  const isFr = locale === "fr";

  return {
    metadataBase: new URL(base),
    title: {
      default: t("title"),
      template: isFr
        ? `%s · Thomas Barthelemy — Développeur web à Alès`
        : `%s · Thomas Barthelemy — Web Developer in Alès`,
    },
    description: t("description"),
    keywords: isFr
      ? [
          "développeur web Alès",
          "création site internet Alès",
          "site web Alès",
          "agence web Alès",
          "développeur web Gard",
          "création site vitrine Alès",
          "refonte site web Alès",
          "freelance web Alès",
          "site internet Gard",
          "développeur web freelance Alès",
          "création site e-commerce Alès",
          "développeur WordPress Alès",
          "Thomas Barthelemy",
        ]
      : [
          "web developer Alès France",
          "freelance web developer France",
          "website creation France",
          "Next.js developer France",
          "Thomas Barthelemy",
        ],
    authors: [{ name: site.shortName, url: base }],
    creator: site.shortName,
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: `${base}/${locale}`,
      siteName: site.shortName,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t("ogAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
    alternates: {
      canonical: `${base}/${locale}`,
      languages: {
        fr: `${base}/fr`,
        en: `${base}/en`,
        "x-default": `${base}/${routing.defaultLocale}`,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#05070f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd />
      {children}
    </NextIntlClientProvider>
  );
}
