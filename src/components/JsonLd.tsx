import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { FaqItemsSchema } from "@/lib/i18n-schemas";

export async function JsonLd() {
  const locale = await getLocale();
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tFaq = await getTranslations({ locale, namespace: "Faq" });
  const tJsonLd = await getTranslations({ locale, namespace: "JsonLd" });
  const faqItems = FaqItemsSchema.parse(tFaq.raw("items"));

  const businessId = `${site.url}/#business`;
  const description = tMeta("description");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        "name": tJsonLd("businessName"),
        "description": description,
        "url": `${site.url}/${locale}`,
        "telephone": site.phone,
        "email": site.email,
        "priceRange": "€€",
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Virement bancaire",
        "areaServed": [
          { "@type": "City", "name": "Alès" },
          { "@type": "City", "name": "Nîmes" },
          { "@type": "City", "name": "Uzès" },
          { "@type": "City", "name": "Bagnols-sur-Cèze" },
          { "@type": "AdministrativeArea", "name": "Gard" },
          { "@type": "AdministrativeArea", "name": "Occitanie" },
          { "@type": "Country", "name": "France" },
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": tJsonLd("offerCatalogName"),
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": tJsonLd("offerVitrineName"),
                "description": tJsonLd("offerVitrineDescription"),
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": tJsonLd("offerRefonteName"),
                "description": tJsonLd("offerRefonteDescription"),
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": tJsonLd("offerEcommerceName"),
                "description": tJsonLd("offerEcommerceDescription"),
              },
            },
          ],
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": site.address.street,
          "addressLocality": site.address.city,
          "postalCode": site.address.postalCode,
          "addressRegion": site.address.region,
          "addressCountry": site.address.country,
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": site.geo.latitude,
          "longitude": site.geo.longitude,
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00",
        },
        "sameAs": Object.values(site.social),
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        "name": site.shortName,
        "jobTitle": tJsonLd("personJobTitle"),
        "worksFor": { "@id": businessId },
        "url": `${site.url}/${locale}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Alès",
          "addressRegion": "Gard",
          "addressCountry": "FR",
        },
        "sameAs": Object.values(site.social),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        "url": site.url,
        "name": site.name,
        "description": description,
        "inLanguage": locale === "fr" ? "fr-FR" : "en-US",
        "publisher": { "@id": businessId },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
