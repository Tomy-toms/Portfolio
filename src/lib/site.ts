export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Thomas Barthelemy — Portfolio",
  shortName: "Thomas Barthelemy",
  role: "Full-Stack Web Developer",
  tagline:
    "Full-stack web developer — I build fast, accessible, delightful web experiences.",
  location: "Paris, France",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  social: {
    github: "https://github.com/Tomy-toms",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
    dribbble: "https://dribbble.com/",
  },
  skills: [
    { name: "TypeScript", level: 95, group: "Language" },
    { name: "React / Next.js", level: 95, group: "Framework" },
    { name: "Node.js", level: 88, group: "Backend" },
    { name: "PostgreSQL", level: 80, group: "Data" },
    { name: "Tailwind CSS", level: 92, group: "UI" },
    { name: "Framer Motion", level: 85, group: "Motion" },
    { name: "GraphQL", level: 75, group: "Data" },
    { name: "Docker", level: 70, group: "DevOps" },
    { name: "Figma", level: 78, group: "Design" },
    { name: "AWS", level: 65, group: "DevOps" },
  ] as const,
};

export type SiteConfig = typeof site;
