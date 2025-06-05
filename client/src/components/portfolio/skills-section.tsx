import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type Skill } from "@shared/schema";
import { Code, Server, Cloud, Wrench } from "lucide-react";

const categoryIcons = {
  frontend: Code,
  backend: Server,
  cloud: Cloud,
  tools: Wrench,
};

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend", 
  cloud: "Cloud & DevOps",
  tools: "Tools & Design",
};

export default function SkillsSection() {
  const { data: skills, isLoading, error } = useQuery({
    queryKey: ["/api/skills"],
  });

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-destructive">Failed to load skills. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // Group skills by category
  const skillsByCategory = skills?.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-yellow-400";
      case "intermediate":
        return "text-blue-400";
      case "advanced":
        return "text-green-400";
      case "expert":
        return "text-purple-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Skills & Technologies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of the technologies and tools I use to build exceptional applications.
          </p>
        </div>
        
        {!skills || skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No skills information available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;
              const categoryLabel = categoryLabels[category as keyof typeof categoryLabels] || category;
              
              return (
                <Card key={category} className="bg-muted/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-primary">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{categoryLabel}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                          <span className={`text-xs font-medium ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={skill.percentage} className="h-2" />
                          <div className="flex justify-end">
                            <span className="text-xs text-muted-foreground">{skill.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
