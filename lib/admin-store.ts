"use client";
import type { AdminData, ContactMessage } from "./admin-types";
export type { AdminData } from "./admin-types";

export const ADMIN_KEY = "devos_admin_data";
export const ADMIN_AUTH_KEY = "devos_admin_auth";
export const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "9950";

export const defaultAdminData: AdminData = {
  hero: {
    firstName: "Alex",
    lastName: "Chen",
    roles: ["Full Stack Developer", "UI/UX Engineer", "3D Creative Dev", "System Architect"],
    subtitle: "Crafting digital experiences that push the boundaries of what's possible on the modern web.",
    statusText: "Available for work",
    statusActive: true,
    ctaPrimary: "View Projects",
    ctaPrimaryLink: "#projects",
    ctaSecondary: "Open Terminal",
    ctaSecondaryLink: "#terminal-section",
    avatarEmoji: "👨‍💻",
    floatCard1Val: "5+ Years",
    floatCard1Sub: "Experience",
    floatCard2Val: "80+ Projects",
    floatCard2Sub: "Shipped",
  },
  about: {
    bio: "I'm a passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud infrastructure, with a deep love for performance optimization and clean architecture.",
    location: "San Francisco, CA",
    email: "alex@devportfolio.io",
    availabilityStatus: "Open to opportunities",
    stats: [
      { label: "Years Experience", value: "5+" },
      { label: "Projects Shipped", value: "80+" },
      { label: "Happy Clients", value: "30+" },
      { label: "Coffee Cups", value: "∞" },
    ],
  },
  experience: [
    { id: "exp-1", year: "2023 — Now", role: "Senior Full Stack Engineer", company: "TechCorp Inc.", description: "Leading development of next-gen SaaS platform serving 100K+ users.", sortOrder: 0 },
    { id: "exp-2", year: "2021 — 2023", role: "Frontend Engineer", company: "StartupXYZ", description: "Built and scaled React applications from 0 to 50K users.", sortOrder: 1 },
    { id: "exp-3", year: "2019 — 2021", role: "Junior Developer", company: "Agency Digital", description: "Developed client websites and e-commerce solutions.", sortOrder: 2 },
  ],
  projects: [
    { id: "proj-1", title: "NeuralDash", description: "An AI-powered analytics dashboard with real-time data visualization and predictive insights for enterprise teams.", tags: ["React", "Python", "TensorFlow", "PostgreSQL"], github: "https://github.com", live: "https://example.com", category: "AI", featured: true, sortOrder: 0 },
    { id: "proj-2", title: "CipherChat", description: "End-to-end encrypted messaging platform with zero-knowledge architecture and self-destructing messages.", tags: ["Next.js", "WebRTC", "Node.js", "Redis"], github: "https://github.com", live: "https://example.com", category: "Security", featured: true, sortOrder: 1 },
    { id: "proj-3", title: "VoxForge", description: "A 3D audio visualization tool that converts music into interactive geometric art using WebAudio API.", tags: ["Three.js", "WebAudio", "GSAP", "React"], github: "https://github.com", live: "", category: "Creative", featured: false, sortOrder: 2 },
    { id: "proj-4", title: "OrbitalDB", description: "Distributed database management system with visual schema design and real-time collaboration features.", tags: ["Rust", "PostgreSQL", "WebSocket", "React"], github: "https://github.com", live: "", category: "Backend", featured: false, sortOrder: 3 },
  ],
  skills: [
    { id: "sk-1", name: "React / Next.js", category: "Frontend", icon: "⚛️", sortOrder: 0 },
    { id: "sk-2", name: "TypeScript", category: "Language", icon: "📘", sortOrder: 1 },
    { id: "sk-3", name: "Node.js", category: "Backend", icon: "🟢", sortOrder: 2 },
    { id: "sk-4", name: "Python", category: "Language", icon: "🐍", sortOrder: 3 },
    { id: "sk-5", name: "PostgreSQL", category: "Database", icon: "🗄️", sortOrder: 4 },
    { id: "sk-6", name: "Redis", category: "Database", icon: "🔴", sortOrder: 5 },
    { id: "sk-7", name: "Docker", category: "DevOps", icon: "🐳", sortOrder: 6 },
    { id: "sk-8", name: "AWS", category: "Cloud", icon: "☁️", sortOrder: 7 },
    { id: "sk-9", name: "GraphQL", category: "API", icon: "◈", sortOrder: 8 },
    { id: "sk-10", name: "Three.js", category: "3D/WebGL", icon: "🎮", sortOrder: 9 },
    { id: "sk-11", name: "Framer Motion", category: "Animation", icon: "✨", sortOrder: 10 },
    { id: "sk-12", name: "Tailwind CSS", category: "Frontend", icon: "💨", sortOrder: 11 },
  ],
  terminalCommands: [
    { id: "cmd-help", trigger: "help", description: "Show all commands", hidden: false, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "ok", text: "║  DEV.OS Terminal — Commands          ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "out", text: "  help           — Show this menu" }, { type: "out", text: "  about          — About the developer" }, { type: "out", text: "  projects        — List all projects" }, { type: "out", text: "  skills          — Display tech stack" }, { type: "out", text: "  contact         — Contact info" }, { type: "out", text: "  clear           — Clear terminal" }, { type: "out", text: "  theme matrix    — Matrix mode" }, { type: "out", text: "  theme lime      — Reset theme" }, { type: "sys", text: "──────────────────────────────────────" }, { type: "warn", text: "  Hidden commands exist. Find them." }], action: "none", sortOrder: 0 },
    { id: "cmd-about", trigger: "about", description: "About the developer", hidden: false, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "ok", text: "║  PROFILE // Alex Chen                ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "out", text: "  Role      › Full Stack Developer" }, { type: "out", text: "  Location  › San Francisco, CA" }, { type: "out", text: "  XP        › 5+ years" }, { type: "out", text: "  Status    › Open to opportunities" }], action: "openSection", actionValue: "#about", sortOrder: 1 },
    { id: "cmd-projects", trigger: "projects", description: "List all projects", hidden: false, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "ok", text: "║  PROJECTS // Selected Work           ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "out", text: "  [01] NeuralDash   — AI Analytics" }, { type: "out", text: "  [02] CipherChat   — E2E Messaging" }, { type: "out", text: "  [03] VoxForge     — 3D Audio Visual" }, { type: "out", text: "  [04] OrbitalDB    — Distributed DB" }], action: "openSection", actionValue: "#projects", sortOrder: 2 },
    { id: "cmd-skills", trigger: "skills", description: "Show tech stack", hidden: false, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "ok", text: "║  SKILLS // Tech Arsenal              ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "out", text: "  Frontend  › React, Next.js, TypeScript" }, { type: "out", text: "  Backend   › Node.js, Python, Rust" }, { type: "out", text: "  Database  › PostgreSQL, Redis" }, { type: "out", text: "  Cloud     › AWS, GCP, Docker" }], action: "none", sortOrder: 3 },
    { id: "cmd-contact", trigger: "contact", description: "Contact information", hidden: false, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "ok", text: "║  CONTACT // Get In Touch             ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "out", text: "  Email    › alex@devportfolio.io" }, { type: "out", text: "  GitHub   › github.com/alexchen" }], action: "openSection", actionValue: "#contact", sortOrder: 4 },
    { id: "cmd-clear", trigger: "clear", description: "Clear terminal output", hidden: false, output: [], action: "clearTerminal", sortOrder: 5 },
    { id: "cmd-matrix", trigger: "theme matrix", description: "Activate matrix rain", hidden: false, output: [{ type: "ok", text: "  ✓ Matrix mode activated." }, { type: "warn", text: "  Type 'theme lime' to exit." }], action: "triggerMatrix", sortOrder: 6 },
    { id: "cmd-lime", trigger: "theme lime", description: "Reset theme", hidden: false, output: [{ type: "ok", text: "  ✓ Theme reset to DEV.OS default." }], action: "none", sortOrder: 7 },
    { id: "cmd-music-on", trigger: "music on", description: "Play ambient music", hidden: false, output: [{ type: "ok", text: "  ✓ Ambient music activated — NEURAL_DRIFT.wav" }], action: "toggleMusic", sortOrder: 8 },
    { id: "cmd-music-off", trigger: "music off", description: "Stop music", hidden: false, output: [{ type: "ok", text: "  ✓ Ambient music stopped." }], action: "none", sortOrder: 9 },
    { id: "cmd-glitch", trigger: "glitch.dev", description: "Trigger RGB glitch effect", hidden: true, output: [{ type: "warn", text: "  ⚡ RGB GLITCH INITIATED" }, { type: "warn", text: "  Visual artifacts incoming..." }], action: "triggerGlitch", sortOrder: 10 },
    { id: "cmd-root", trigger: "root.dev", description: "Access denied joke", hidden: true, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "err", text: "║  ✗ ROOT ACCESS DENIED                ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "err", text: "  Unauthorized attempt logged." }, { type: "warn", text: "  Nice try. Keep digging." }], action: "none", sortOrder: 11 },
    { id: "cmd-awaken", trigger: "awaken.system", description: "Open hidden admin panel", hidden: true, output: [{ type: "sys", text: "╔══════════════════════════════════════╗" }, { type: "ok", text: "║  ⚡ SYSTEM AWAKENING...              ║" }, { type: "sys", text: "╚══════════════════════════════════════╝" }, { type: "ok", text: "  Decrypting admin credentials..." }, { type: "warn", text: "  Password required to proceed." }], action: "openAdmin", sortOrder: 12 },
  ],
  messages: [],
  theme: { accentColor: "#D9FF00", bgColor: "#050505", glowIntensity: 50 },
  seo: {
    title: "Alex Chen — Full Stack Developer & Creative Engineer",
    description: "Full Stack Developer specializing in React, Next.js, and immersive digital experiences.",
    keywords: "full stack developer, react, next.js, typescript, portfolio, web development",
    ogImage: "",
  },
  performance: { particlesEnabled: true, cursorEnabled: true, animationsEnabled: true, matrixAvailable: true },
  sections: [
    { id: "hero", label: "Hero", visible: true, sortOrder: 0 },
    { id: "about", label: "About", visible: true, sortOrder: 1 },
    { id: "projects", label: "Projects", visible: true, sortOrder: 2 },
    { id: "skills", label: "Skills", visible: true, sortOrder: 3 },
    { id: "terminal", label: "Terminal", visible: true, sortOrder: 4 },
    { id: "contact", label: "Contact", visible: true, sortOrder: 5 },
  ],
  contact: {
    email: "alex@devportfolio.io",
    location: "San Francisco, CA",
    phone: "",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    resumeUrl: "#",
    footerText: "Building immersive digital experiences with precision and passion.",
  },
  terminal: { enabled: true, startupText: "DEV.OS TERMINAL v2.0.26", typingSpeed: 60, prompt: "[dev@os ~]$" },
};

function deepMerge(base: Record<string, unknown>, over: Record<string, unknown>): Record<string, unknown> {
  const r = { ...base };
  for (const k of Object.keys(over)) {
    if (over[k] !== null && typeof over[k] === "object" && !Array.isArray(over[k]) && typeof base[k] === "object" && base[k] !== null && !Array.isArray(base[k])) {
      r[k] = deepMerge(base[k] as Record<string, unknown>, over[k] as Record<string, unknown>);
    } else {
      r[k] = over[k];
    }
  }
  return r;
}

export function loadAdminData(): AdminData {
  if (typeof window === "undefined") return defaultAdminData;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return defaultAdminData;
    return deepMerge(defaultAdminData as unknown as Record<string, unknown>, JSON.parse(raw)) as unknown as AdminData;
  } catch { return defaultAdminData; }
}

export function saveAdminData(updates: Partial<AdminData>): void {
  if (typeof window === "undefined") return;
  const existing = loadAdminData();
  const merged = deepMerge(existing as unknown as Record<string, unknown>, updates as unknown as Record<string, unknown>);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("admin-updated", { detail: merged }));
}

export function resetAdminData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new CustomEvent("admin-updated", { detail: defaultAdminData }));
}

export function useAdminDataEvent(cb: (data: AdminData) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent).detail as AdminData);
  window.addEventListener("admin-updated", handler);
  return () => window.removeEventListener("admin-updated", handler);
}

export function addMessage(msg: Omit<ContactMessage, "id" | "read" | "starred" | "createdAt">): void {
  const data = loadAdminData();
  const newMsg: ContactMessage = { ...msg, id: `msg-${Date.now()}`, read: false, starred: false, createdAt: new Date().toISOString() };
  saveAdminData({ messages: [newMsg, ...(data.messages ?? [])] });
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";
}

export function setAdminAuth(val: boolean): void {
  if (typeof window === "undefined") return;
  if (val) sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
  else sessionStorage.removeItem(ADMIN_AUTH_KEY);
}
