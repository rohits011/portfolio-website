import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSkillSchema, type Skill, type InsertSkill } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function SkillsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills, isLoading } = useQuery({
    queryKey: ["/api/skills"],
  });

  const form = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: "",
      category: "frontend",
      level: "intermediate",
      percentage: 50,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const response = await apiRequest("POST", "/api/skills", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create skill", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertSkill }) => {
      const response = await apiRequest("PUT", `/api/skills/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill updated successfully" });
      setIsDialogOpen(false);
      setEditingSkill(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update skill", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({ title: "Skill deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete skill", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertSkill) => {
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    form.reset(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewSkill = () => {
    setEditingSkill(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: "bg-blue-500/20 text-blue-400",
      backend: "bg-green-500/20 text-green-400",
      cloud: "bg-purple-500/20 text-purple-400",
      tools: "bg-orange-500/20 text-orange-400",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: "bg-yellow-500/20 text-yellow-400",
      intermediate: "bg-blue-500/20 text-blue-400",
      advanced: "bg-green-500/20 text-green-400",
      expert: "bg-purple-500/20 text-purple-400",
    };
    return colors[level as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  if (isLoading) {
    return <div>Loading skills...</div>;
  }

  const skillsByCategory = skills?.reduce((acc: any, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Skills</h2>
          <p className="text-muted-foreground">Manage your technical skills</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
              <DialogDescription>
                {editingSkill 
                  ? "Update your skill details"
                  : "Add a new skill to your portfolio"
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, AWS..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="frontend">Frontend</SelectItem>
                          <SelectItem value="backend">Backend</SelectItem>
                          <SelectItem value="cloud">Cloud & DevOps</SelectItem>
                          <SelectItem value="tools">Tools & Design</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingSkill ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
              <CardDescription>
                {(categorySkills as Skill[]).length} skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(categorySkills as Skill[]).map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(skill)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(skill.id)}
                        className="h-6 w-6 p-0"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <Badge className={getLevelColor(skill.level)}>
                      {skill.level}
                    </Badge>
                    <span className="text-muted-foreground">{skill.percentage}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {skills?.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No skills yet. Add your first skill!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
