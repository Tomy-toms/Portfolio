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
import { getPublishedProjects } from "@/lib/projects-data";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await getPublishedProjects();

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} className="relative scroll-mt-24 outline-none">
        <Hero />
        <Services />
        <Projects projects={projects} />
        <Pricing />
        <About />
        <Experience />
        <Method />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
