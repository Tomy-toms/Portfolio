export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Thomas Barthelemy — Portfolio",
  shortName: "Thomas Barthelemy",
  role: "Web Developer",
  tagline:
    "Independent web developer based in Alès, France — fast, Google-friendly websites built to convert.",
  location: "Alès, France",
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
