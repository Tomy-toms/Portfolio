import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { WhyWebsite } from "@/components/WhyWebsite";
import { Projects } from "@/components/Projects";
import { Method } from "@/components/Method";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Faq } from "@/components/Faq";
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

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getProjects();

  return (
    <>
      <AnimatedBackground />
      <ScrollProgress />
      <CustomCursor />
      <Nav />
      <main id="top" className="relative">
        <Hero />
        <Services />
        <WhyWebsite />
        <Projects projects={projects} />
        <Method />
        <Pricing />
        <Testimonials />
        <About />
        <Skills />
        <Experience />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
