import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { type Profile } from "@shared/schema";

export default function AboutSection() {
  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
  });

  if (!profile) {
    return (
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my background, passion, and what drives me as a developer.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slideInFromLeft">
            <div className="prose prose-lg text-muted-foreground max-w-none">
              <p className="leading-relaxed">
                {profile.aboutText}
              </p>
              <p className="leading-relaxed">
                {profile.aboutText2}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-primary mb-2">Location</h4>
                  <p className="text-muted-foreground">{profile.location}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-primary mb-2">Experience</h4>
                  <p className="text-muted-foreground">{profile.experience}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-primary mb-2">Education</h4>
                  <p className="text-muted-foreground">{profile.education}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-primary mb-2">Status</h4>
                  <p className="text-muted-foreground">{profile.status}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="relative animate-slideInFromRight">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Developer workspace with multiple monitors and code" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
