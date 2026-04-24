import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Method } from "@/components/Method";
import { Pricing } from "@/components/Pricing";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

function devMockProjects() {
  const now = new Date();
  const bg = (color: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#0a0d17"/></linearGradient></defs><rect width="600" height="800" fill="url(#g)"/></svg>`
    )}`;
  const base = [
    { title: "Aurora Dashboard", tagline: "Tableau de bord analytique temps réel", category: "SaaS", tech: ["Next.js", "tRPC", "Postgres", "Tailwind"], color: "#8b5cf6", featured: true },
    { title: "Lumen CMS", tagline: "CMS headless pour équipes éditoriales", category: "Web", tech: ["Remix", "Prisma", "TypeScript"], color: "#22d3ee", featured: false },
    { title: "Parcel Route", tagline: "Optimisation de tournées de livraison", category: "Mobile", tech: ["React Native", "Mapbox", "Node"], color: "#ec4899", featured: false },
    { title: "Oak Commerce", tagline: "Boutique en ligne modulaire", category: "E-commerce", tech: ["Next.js", "Stripe", "Contentful"], color: "#10b981", featured: true },
  ];
  return base.map((p, i) => ({
    id: `mock-${i}`,
    slug: `mock-${i}`,
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
  }));
}

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    if (projects.length === 0 && process.env.NODE_ENV === "development") {
      console.warn("[page] DB returned 0 projects — using dev mock projects.");
      return devMockProjects();
    }
    return projects;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[page] DB unavailable — using dev mock projects.", e);
      return devMockProjects();
    }
    console.warn("[page] DB unavailable — rendering with empty projects.", e);
    return [];
  }
}

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="top" className="relative">
        <Hero />
        <Services />
        <Projects projects={projects} />
        <Method />
        <Pricing />
        <About />
        <Experience />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
