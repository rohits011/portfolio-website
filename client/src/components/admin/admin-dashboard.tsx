import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectManagement from "./project-management";
import SkillsManagement from "./skills-management";
import ExperienceManagement from "./experience-management";
import ProfileManagement from "./profile-management";
import MessagesView from "./messages-view";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings, 
  Briefcase, 
  User, 
  MessageSquare, 
  LogOut,
  Eye,
  Mail
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
  });

  const { data: experiences } = useQuery({
    queryKey: ["/api/experiences"],
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/messages"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const stats = {
    totalProjects: projects?.length || 0,
    totalSkills: skills?.length || 0,
    totalExperiences: experiences?.length || 0,
    totalMessages: messages?.length || 0,
    unreadMessages: messages?.filter((m: any) => !m.read).length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Portfolio Admin</h1>
          <Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-80px)]">
          <nav className="p-4">
            <div className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "projects" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("projects")}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Projects
              </Button>
              <Button
                variant={activeTab === "skills" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("skills")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Skills
              </Button>
              <Button
                variant={activeTab === "experience" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("experience")}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Experience
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant={activeTab === "messages" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("messages")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
                {stats.unreadMessages > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1">
                    {stats.unreadMessages}
                  </span>
                )}
              </Button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                <p className="text-muted-foreground">
                  Overview of your portfolio content and recent activity
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Skills</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSkills}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Experience</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalExperiences}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Messages</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMessages}</div>
                    {stats.unreadMessages > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {stats.unreadMessages} unread
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>Your latest portfolio projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projects?.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="flex items-center space-x-4 py-2">
                        <div className="flex-1">
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground">{project.status}</p>
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground">No projects yet</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Latest contact form submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {messages?.slice(0, 3).map((message: any) => (
                      <div key={message.id} className="flex items-center space-x-4 py-2">
                        <div className="flex-1">
                          <p className="font-medium">{message.name}</p>
                          <p className="text-sm text-muted-foreground">{message.subject}</p>
                        </div>
                        {!message.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    )) || <p className="text-muted-foreground">No messages yet</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "projects" && <ProjectManagement />}
          {activeTab === "skills" && <SkillsManagement />}
          {activeTab === "experience" && <ExperienceManagement />}
          {activeTab === "profile" && <ProfileManagement />}
          {activeTab === "messages" && <MessagesView />}
        </main>
      </div>
    </div>
  );
}
