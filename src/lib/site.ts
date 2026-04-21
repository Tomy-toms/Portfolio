export const site = {
  name: "Alex Doe — Web Developer",
  shortName: "Alex Doe",
  role: "Full-Stack Web Developer",
  tagline: "I build fast, accessible, delightful web experiences.",
  bio:
    "I'm a full-stack developer with a designer's eye — shipping production apps with Next.js, TypeScript, and Node. I care about performance, motion, and making interfaces feel alive.",
  location: "Paris, France",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  social: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
    dribbble: "https://dribbble.com/",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Journey", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
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
  experience: [
    {
      role: "Senior Full-Stack Engineer",
      company: "Lumen Studio",
      period: "2023 — Present",
      location: "Remote",
      points: [
        "Lead rebuilds of marketing + app surfaces in Next.js 14 with a 40% LCP improvement.",
        "Shipped a design system adopted across 5 product squads.",
      ],
    },
    {
      role: "Product Engineer",
      company: "Northwind",
      period: "2021 — 2023",
      location: "Paris, FR",
      points: [
        "Owned the checkout stack (Stripe + Node) processing €8M/yr.",
        "Mentored 3 juniors and introduced contract-testing.",
      ],
    },
    {
      role: "Freelance Developer",
      company: "Independent",
      period: "2019 — 2021",
      location: "Paris, FR",
      points: [
        "Delivered 20+ sites for agencies and startups.",
        "Built custom CMS integrations and e-commerce flows.",
      ],
    },
  ] as const,
};

export type SiteConfig = typeof site;
