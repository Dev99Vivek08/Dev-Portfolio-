export interface HeroData {
  firstName: string;
  lastName: string;
  roles: string[];
  subtitle: string;
  statusText: string;
  statusActive: boolean;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  avatarEmoji: string;
  floatCard1Val: string;
  floatCard1Sub: string;
  floatCard2Val: string;
  floatCard2Sub: string;
}

export interface AboutStat { label: string; value: string; }

export interface AboutData {
  bio: string;
  location: string;
  email: string;
  availabilityStatus: string;
  stats: AboutStat[];
}

export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  github?: string;
  live?: string;
  category: string;
  featured: boolean;
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  sortOrder: number;
}

export type TOutputType = "sys" | "ok" | "warn" | "err" | "out";
export type TAction =
  | "none" | "openSection" | "openURL" | "triggerGlitch"
  | "triggerMatrix" | "openAdmin" | "clearTerminal" | "toggleMusic";

export interface TerminalOutputLine { type: TOutputType; text: string; }

export interface TerminalCommand {
  id: string;
  trigger: string;
  description: string;
  hidden: boolean;
  output: TerminalOutputLine[];
  action: TAction;
  actionValue?: string;
  sortOrder: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  starred: boolean;
  createdAt: string;
}

export interface ThemeSettings {
  accentColor: string;
  bgColor: string;
  glowIntensity: number;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface PerformanceSettings {
  particlesEnabled: boolean;
  cursorEnabled: boolean;
  animationsEnabled: boolean;
  matrixAvailable: boolean;
}

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
  sortOrder: number;
}

export interface ContactSettings {
  email: string;
  location: string;
  phone: string;
  github: string;
  twitter: string;
  linkedin: string;
  resumeUrl: string;
  footerText: string;
}

export interface TerminalSettings {
  enabled: boolean;
  startupText: string;
  typingSpeed: number;
  prompt: string;
}

export interface AdminData {
  hero: HeroData;
  about: AboutData;
  experience: ExperienceItem[];
  projects: Project[];
  skills: Skill[];
  terminalCommands: TerminalCommand[];
  messages: ContactMessage[];
  theme: ThemeSettings;
  seo: SEOSettings;
  performance: PerformanceSettings;
  sections: SectionConfig[];
  contact: ContactSettings;
  terminal: TerminalSettings;
}
