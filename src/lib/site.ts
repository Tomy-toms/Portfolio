// Single source of truth for brand / contact / NAP info. Kept here (not in env)
// so it stays editable without redeploy and visible in code review.

const phone = "+33689887678";

function frenchSpaced(intl: string): string {
  // "+33689887678" → "06 89 88 76 78"
  return intl
    .replace("+33", "0")
    .replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
}

export const site = {
  name:
    process.env.NEXT_PUBLIC_SITE_NAME ??
    "Thomas Barthelemy — Développeur web à Alès",
  shortName: "Thomas Barthelemy",
  role: "Développeur web freelance",
  tagline:
    "Développeur web freelance à Alès (Gard) — sites internet rapides, visibles sur Google, livrés en 2 à 4 semaines.",
  location: "Alès, Gard, France",
  phone,
  phoneDisplay: "06 89 88 76 78",
  phoneFormatted: frenchSpaced(phone),
  address: {
    street: "1386 Route d'Auzas",
    city: "Saint-Jean-du-Pin",
    postalCode: "30140",
    region: "Gard",
    country: "FR",
    display: "Alès (30)",
  },
  geo: {
    latitude: 44.1354,
    longitude: 4.0832,
  },
  email:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://thomasbarthelemy.fr",
  social: {
    linkedin: "https://www.linkedin.com/in/ithomasbarthelemy",
    malt: "https://www.malt.fr/profile/thomasbarthelemy1",
    github: "https://github.com/Tomy-toms",
  },
  legal: {
    // Date affichée en bas des pages /legal et /privacy. À mettre à jour à
    // chaque modification substantielle des mentions légales / RGPD.
    lastUpdated: "2026-04-22",
  },
};

export type SiteConfig = typeof site;
