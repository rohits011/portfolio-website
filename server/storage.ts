import { 
  users, profile, projects, skills, experiences, messages,
  type User, type InsertUser,
  type Profile, type InsertProfile,
  type Project, type InsertProject,
  type Skill, type InsertSkill,
  type Experience, type InsertExperience,
  type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile methods
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Skill methods
  getSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Experience methods
  getExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;

  // Message methods
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteMessage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<number, Profile>;
  private projects: Map<number, Project>;
  private skills: Map<number, Skill>;
  private experiences: Map<number, Experience>;
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.projects = new Map();
    this.skills = new Map();
    this.experiences = new Map();
    this.messages = new Map();
    this.currentId = 1;

    // Initialize with admin user and sample data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "admin123" // In production, this should be hashed
    };
    this.users.set(adminUser.id, adminUser);

    // Create default profile
    const defaultProfile: Profile = {
      id: this.currentId++,
      name: "John Doe",
      title: "Full Stack Developer",
      bio: "Passionate developer with 5+ years of experience creating innovative web applications and solving complex problems with clean, efficient code.",
      aboutText: "I'm a passionate full-stack developer with over 5 years of experience building scalable web applications. My journey started with a Computer Science degree, and I've since worked with startups and established companies to bring innovative digital solutions to life.",
      aboutText2: "I specialize in modern JavaScript frameworks, cloud architecture, and creating user-centric applications that solve real-world problems. When I'm not coding, you'll find me contributing to open-source projects or mentoring aspiring developers.",
      location: "San Francisco, CA",
      experience: "5+ Years",
      education: "CS Degree",
      status: "Available",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      resumeUrl: null,
      profileImage: null
    };
    this.profiles.set(defaultProfile.id, defaultProfile);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    return Array.from(this.profiles.values())[0];
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentId++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: number, updateData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;
    
    const updated: Profile = { ...existing, ...updateData };
    this.profiles.set(id, updated);
    return updated;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.featured && p.status === 'published')
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: Project = { ...existing, ...updateData };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(s => s.category === category);
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentId++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, updateData: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existing = this.skills.get(id);
    if (!existing) return undefined;
    
    const updated: Skill = { ...existing, ...updateData };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).sort((a, b) => b.order - a.order);
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const experience: Experience = { ...insertExperience, id };
    this.experiences.set(id, experience);
    return experience;
  }

  async updateExperience(id: number, updateData: Partial<InsertExperience>): Promise<Experience | undefined> {
    const existing = this.experiences.get(id);
    if (!existing) return undefined;
    
    const updated: Experience = { ...existing, ...updateData };
    this.experiences.set(id, updated);
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      read: false,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;
    
    const updated = { ...message, read: true };
    this.messages.set(id, updated);
    return true;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
}

export const storage = new MemStorage();
