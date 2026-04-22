import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

export async function JsonLd() {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.shortName,
    jobTitle: site.role,
    description: t("description"),
    url: `${site.url}/${locale}`,
    email: `mailto:${site.email}`,
    sameAs: Object.values(site.social),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
