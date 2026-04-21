import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-in-production";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin", role: "ADMIN" },
  });
  console.log(`✓ Admin upserted: ${email}`);

  const projects = [
    {
      slug: "aurora-analytics",
      title: "Aurora Analytics",
      tagline: "Real-time dashboards for product teams",
      description:
        "A real-time analytics platform with sub-second event ingestion, cohort analysis, and an SQL-optional query builder. Built with Next.js, ClickHouse, and WebSockets.",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/",
      tech: ["Next.js", "TypeScript", "ClickHouse", "WebSockets", "Tailwind"],
      category: "Web App",
      featured: true,
      order: 1,
    },
    {
      slug: "prism-commerce",
      title: "Prism Commerce",
      tagline: "Headless storefront with a cinematic feel",
      description:
        "A headless e-commerce front-end with product storytelling, Shopify Storefront API, and scroll-driven scene transitions.",
      imageUrl:
        "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1600&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/",
      tech: ["Next.js", "Shopify", "Framer Motion", "GSAP", "Stripe"],
      category: "E-commerce",
      featured: true,
      order: 2,
    },
    {
      slug: "signal-crm",
      title: "Signal CRM",
      tagline: "A pipeline tool teams actually enjoy",
      description:
        "Opinionated CRM with drag-and-drop pipelines, AI-summarized call notes, and a keyboard-first command palette.",
      imageUrl:
        "https://images.unsplash.com/photo-1529336953128-a85760f58cb5?auto=format&fit=crop&w=1600&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/",
      tech: ["Next.js", "tRPC", "Prisma", "Postgres", "OpenAI"],
      category: "SaaS",
      featured: true,
      order: 3,
    },
    {
      slug: "nomad-journal",
      title: "Nomad Journal",
      tagline: "MDX-powered travel log with maps",
      description:
        "A custom blog platform with MDX, Mapbox story maps, and edge-cached OG images.",
      imageUrl:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1600&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/",
      tech: ["Next.js", "MDX", "Mapbox", "Edge Functions"],
      category: "Content",
      featured: false,
      order: 4,
    },
    {
      slug: "tempo-booking",
      title: "Tempo Booking",
      tagline: "Calendly-style scheduling for studios",
      description:
        "A booking platform for music studios with resource scheduling, Stripe deposits, and a public embedded widget.",
      imageUrl:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/",
      tech: ["Next.js", "Node", "Postgres", "Stripe"],
      category: "SaaS",
      featured: false,
      order: 5,
    },
    {
      slug: "orbit-docs",
      title: "Orbit Docs",
      tagline: "Open-source docs engine",
      description:
        "A developer-docs starter with MDX, algolia search, dark-mode code blocks, and CLI generators.",
      imageUrl:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=80",
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/",
      tech: ["Next.js", "MDX", "Algolia", "Shiki"],
      category: "Open Source",
      featured: false,
      order: 6,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✓ Seeded ${projects.length} projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
