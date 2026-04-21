import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return projects;
  } catch (e) {
    console.warn("[page] DB unavailable — rendering with empty projects.", e);
    return [];
  }
}

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <>
      <AnimatedBackground />
      <ScrollProgress />
      <CustomCursor />
      <Nav />
      <main id="top" className="relative">
        <Hero />
        <About />
        <Projects projects={projects} />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
