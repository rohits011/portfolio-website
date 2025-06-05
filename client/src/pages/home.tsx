import Navigation from "@/components/portfolio/navigation";
import HeroSection from "@/components/portfolio/hero-section";
import AboutSection from "@/components/portfolio/about-section";
import ProjectsSection from "@/components/portfolio/projects-section";
import SkillsSection from "@/components/portfolio/skills-section";
import ExperienceSection from "@/components/portfolio/experience-section";
import ContactSection from "@/components/portfolio/contact-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Built with passion and modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
