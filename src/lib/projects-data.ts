import { unstable_cache } from "next/cache";
import type { Project } from "@prisma/client";
import { prisma } from "./prisma";

export const PROJECTS_TAG = "projects";

function placeholderProjects(): Project[] {
  const now = new Date();
  const bg = (color: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#0a0d17"/></linearGradient></defs><rect width="600" height="800" fill="url(#g)"/></svg>`
    )}`;
  const base = [
    {
      title: "Site vitrine — Artisan menuisier",
      tagline:
        "Site vitrine professionnel pour un artisan menuisier. SEO local, galerie réalisations, devis en ligne.",
      category: "Site vitrine",
      tech: ["Next.js", "Tailwind CSS", "Vercel", "PostgreSQL"],
      color: "#8b5cf6",
      featured: true,
    },
    {
      title: "E-commerce — Chocolatier artisanal",
      tagline:
        "Boutique en ligne pour un chocolatier du Gard. Paiement Stripe, gestion des stocks, expédition.",
      category: "E-commerce",
      tech: ["Next.js", "Stripe", "Supabase", "TypeScript"],
      color: "#22d3ee",
      featured: false,
    },
    {
      title: "Refonte — Cabinet de kinésithérapie",
      tagline:
        "Refonte complète avec prise de rendez-vous en ligne. Performance +60 %, SEO local amélioré.",
      category: "Refonte",
      tech: ["Next.js", "Tailwind CSS", "PostgreSQL"],
      color: "#ec4899",
      featured: false,
    },
    {
      title: "Outil métier — Agence immobilière",
      tagline:
        "Application web de gestion de biens et de mandats. Interface admin, exports PDF automatisés.",
      category: "Outil métier",
      tech: ["React", "Node.js", "PostgreSQL", "TypeScript"],
      color: "#10b981",
      featured: true,
    },
  ];
  return base.map((p, i) => ({
    id: `placeholder-${i}`,
    slug: `placeholder-${i}`,
    title: p.title,
    tagline: p.tagline,
    description: p.tagline,
    imageUrl: bg(p.color),
    liveUrl: null,
    githubUrl: null,
    tech: p.tech,
    category: p.category,
    featured: p.featured,
    order: i,
    published: true,
    createdAt: now,
    updatedAt: now,
  })) as unknown as Project[];
}

/**
 * Cached read of published projects. Invalidated explicitly via
 * `revalidateTag(PROJECTS_TAG)` in admin write paths, with a 5-minute safety
 * net for any drift. Falls back to placeholder data when the DB is unavailable
 * (preview/local without env) so the homepage never crashes the build.
 */
export const getPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      const projects = await prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      });
      if (projects.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[projects] DB returned 0 projects — using placeholder projects."
          );
        }
        return placeholderProjects();
      }
      return projects;
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[projects] DB unavailable — using placeholder projects.",
          e
        );
      }
      return placeholderProjects();
    }
  },
  ["projects:published"],
  { revalidate: 300, tags: [PROJECTS_TAG] }
);
