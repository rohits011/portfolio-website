import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Experience } from "@shared/schema";
import { Calendar, MapPin } from "lucide-react";

export default function ExperienceSection() {
  const { data: experiences, isLoading, error } = useQuery({
    queryKey: ["/api/experiences"],
  });

  if (isLoading) {
    return (
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading experience...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-destructive">Failed to load experience. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Work Experience</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and the experiences that have shaped my skills and expertise.
          </p>
        </div>
        
        {!experiences || experiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No work experience information available at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary transform md:-translate-x-px"></div>
            
            <div className="space-y-12">
              {experiences.map((experience: Experience, index: number) => (
                <div key={experience.id} className="relative flex items-center">
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full transform md:-translate-x-2 border-4 border-background z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 ${
                    index % 2 === 0 
                      ? "md:w-1/2 md:pr-8 md:text-right" 
                      : "md:w-1/2 md:ml-auto md:pl-8"
                  }`}>
                    <Card className="bg-muted/50">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {experience.title}
                        </h3>
                        <h4 className="text-primary font-medium mb-2">
                          {experience.company}
                        </h4>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{experience.period}</span>
                          {experience.current && (
                            <Badge variant="default" className="ml-2 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {experience.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
