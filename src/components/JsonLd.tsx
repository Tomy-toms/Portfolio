import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.shortName,
    jobTitle: site.role,
    description: site.tagline,
    url: site.url,
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
