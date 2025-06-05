import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Profile } from "@shared/schema";
import { Download, Eye, Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function HeroSection() {
  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
  });

  const scrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!profile) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-pulse text-center">Loading...</div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fadeInUp">
          {/* Profile Image */}
          <div className="w-32 h-32 mx-auto">
            <Avatar className="w-full h-full border-4 border-primary">
              <AvatarImage 
                src={profile.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256"} 
                alt={profile.name}
              />
              <AvatarFallback className="text-2xl font-bold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              {profile.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-primary font-medium mb-6">
              {profile.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {profile.bio}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={scrollToProjects} size="lg" className="px-8">
              <Eye className="w-4 h-4 mr-2" />
              View My Work
            </Button>
            {profile.resumeUrl && (
              <Button variant="outline" size="lg" className="px-8" asChild>
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            )}
          </div>
          
          <div className="flex justify-center space-x-6 pt-8">
            {profile.github && (
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Github className="w-6 h-6" />
              </a>
            )}
            {profile.linkedin && (
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {profile.twitter && (
              <a 
                href={profile.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
