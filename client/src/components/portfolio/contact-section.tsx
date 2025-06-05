import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";

export default function ContactSection() {
  const { toast } = useToast();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
  });

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      const response = await apiRequest("POST", "/api/messages", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
      setIsFormSubmitted(true);
      // Reset form submitted state after 5 seconds
      setTimeout(() => setIsFormSubmitted(false), 5000);
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMessage) => {
    submitMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to work together? I'd love to hear about your project and discuss how we can bring it to life.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Let's Connect</h3>
            
            <div className="space-y-6">
              {profile?.email && (
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Email</h4>
                    <a 
                      href={`mailto:${profile.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              
              {profile?.phone && (
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Phone</h4>
                    <a 
                      href={`tel:${profile.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {profile?.location && (
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Location</h4>
                    <p className="text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            {(profile?.github || profile?.linkedin || profile?.twitter) && (
              <div className="pt-6">
                <h4 className="font-medium text-foreground mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {profile.github && (
                    <a 
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground p-3 rounded-lg transition-colors duration-200"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a 
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground p-3 rounded-lg transition-colors duration-200"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profile.twitter && (
                    <a 
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground p-3 rounded-lg transition-colors duration-200"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {isFormSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Project inquiry" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell me about your project..." 
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
