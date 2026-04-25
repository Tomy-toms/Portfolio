import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

type FaqItem = { q: string; a: string };

export async function JsonLd() {
  const locale = await getLocale();
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tFaq = await getTranslations({ locale, namespace: "Faq" });
  const faqItems = tFaq.raw("items") as FaqItem[];

  const businessId = `${site.url}/#business`;
  const description = tMeta("description");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        "name": "Thomas Barthelemy — Développeur web freelance",
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
          "name": "Création de sites web",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Création de site vitrine",
                "description": "Site vitrine professionnel sur mesure, livré en 2 à 3 semaines. Design moderne, optimisation SEO locale Google, formulaire de contact sécurisé. À partir de 1 500 €.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Refonte de site web",
                "description": "Refonte complète de votre site web existant. Nouveau design, migration de contenu, amélioration des performances et du référencement Google. À partir de 3 000 €.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Création de site e-commerce",
                "description": "Boutique en ligne, espace client, prise de rendez-vous en ligne, outil métier sur mesure. Livraison en 4 à 8 semaines. À partir de 5 000 €.",
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
          "latitude": 44.1354,
          "longitude": 4.0832,
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
        "jobTitle": locale === "fr" ? "Développeur web freelance" : "Freelance Web Developer",
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
