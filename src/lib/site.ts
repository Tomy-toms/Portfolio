export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Thomas Barthelemy — Développeur web à Alès",
  shortName: "Thomas Barthelemy",
  role: "Développeur web freelance",
  tagline:
    "Développeur web freelance à Alès (Gard) — sites internet rapides, visibles sur Google, livrés en 2 à 4 semaines.",
  location: "Alès, Gard, France",
  phone: "+33689887678",
  phoneDisplay: "06 89 88 76 78",
  address: {
    street: "1386 Route d'Auzas",
    city: "Saint-Jean-du-Pin",
    postalCode: "30140",
    region: "Gard",
    country: "FR",
    display: "Alès (30)",
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  social: {
    linkedin: "https://www.linkedin.com/in/ithomasbarthelemy",
    malt: "https://www.malt.fr/profile/thomasbarthelemy1",
    github: "https://github.com/Tomy-toms",
  },
};

export type SiteConfig = typeof site;
