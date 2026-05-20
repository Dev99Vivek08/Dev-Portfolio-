"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInAdmin, signOutAdmin, savePortfolioConfig, loadPortfolioConfig, saveProject, deleteProject, saveSkill, deleteSkill, saveBlogPost, deleteBlogPost, uploadFile } from "@/lib/supabase";
import { loadLocalData, saveLocalData, resetLocalData } from "@/lib/store";
import { defaultData } from "@/lib/data";

interface AdminPanelProps { onClose: () => void; }
type AdminTab = "hero" | "about" | "experience" | "projects" | "skills" | "contact" | "social" | "seo" | "blog" | "terminal" | "appearance";

const tabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: "hero", label: "Hero", icon: "⚡" },
  { id: "about", label: "About", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "skills", label: "Skills", icon: "🔧" },
  { id: "contact", label: "Contact", icon: "✉️" },
  { id: "social", label: "Social", icon: "🌐" },
  { id: "seo", label: "SEO", icon: "🔍" },
  { id: "blog", label: "Blog", icon: "📝" },
  { id: "terminal", label: "Terminal", icon: "💻" },
  { id: "appearance", label: "Settings", icon: "⚙️" },
];

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [step, setStep] = useState<"auth" | "dashboard">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("hero");
  const [authAnimating, setAuthAnimating] = useState(false);
  const [data, setData] = useState(loadLocalData());
  const [supabaseMode, setSupabaseMode] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent;
      setData({ ...defaultData, ...ce.detail });
    };
    window.addEventListener("portfolio-updated", handleUpdate);
    return () => window.removeEventListener("portfolio-updated", handleUpdate);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      await signInAdmin(email, password);
      setSupabaseMode(true);
      const remote = await loadPortfolioConfig();
      if (remote) saveLocalData(remote);
      setAuthAnimating(true);
      setTimeout(() => { setStep("dashboard"); setAuthAnimating(false); }, 1500);
    } catch {
      if (password === "9950" || password === "admin") {
        setAuthAnimating(true);
        setTimeout(() => { setStep("dashboard"); setAuthAnimating(false); }, 1500);
      } else {
        setAuthError("Wrong password. Default: 9950 (or your Supabase credentials)");
      }
    } finally { setLoading(false); }
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setStep("auth"); setEmail(""); setPassword(""); setSupabaseMode(false);
  };

  const updateData = (section: keyof typeof data, value: unknown) => {
    const updated = { ...data, [section]: value };
    setData(updated as typeof data);
    saveLocalData({ [section]: value });
  };

  const syncToSupabase = async () => {
    if (!supabaseMode) return;
    try {
      await savePortfolioConfig({ hero: data.hero, about: data.about, social: data.social });
    } catch (e) { console.error(e); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9970] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.85, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-5xl h-[92vh] overflow-hidden rounded flex flex-col"
        style={{ boxShadow: "0 0 80px rgba(217,255,0,0.15), 0 0 0 1px rgba(217,255,0,0.2)" }}>

        <AnimatePresence mode="wait">
          {step === "auth" ? (
            <AuthScreen key="auth" email={email} setEmail={setEmail} password={password}
              setPassword={setPassword} authError={authError} loading={loading}
              authAnimating={authAnimating} onLogin={handleLogin} onClose={onClose} />
          ) : (
            <Dashboard key="dash" data={data} activeTab={activeTab} setActiveTab={setActiveTab}
              updateData={updateData} onClose={onClose} onSignOut={handleSignOut}
              supabaseMode={supabaseMode} syncToSupabase={syncToSupabase} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function AuthScreen({ email, setEmail, password, setPassword, authError, loading, authAnimating, onLogin, onClose }: {
  email: string; setEmail: (v: string) => void; password: string; setPassword: (v: string) => void;
  authError: string; loading: boolean; authAnimating: boolean;
  onLogin: (e: React.FormEvent) => void; onClose: () => void;
}) {
  return (
    <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="bg-[#080808] p-8 font-mono flex-1 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded border border-[rgba(217,255,0,0.3)] mb-4 bg-[rgba(217,255,0,0.05)]">
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="text-white text-xl font-bold tracking-widest mb-1">ADMIN ACCESS</h2>
        <p className="text-[#9CA3AF] text-xs tracking-widest">Secure authentication required</p>
        <p className="text-[#D9FF00]/60 text-[10px] mt-2 tracking-wide">Default password: 9950</p>
      </div>
      {authAnimating ? (
        <div className="text-center space-y-3 py-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#D9FF00] border-t-transparent rounded-full mx-auto" />
          <div className="text-[#D9FF00] text-xs tracking-[0.3em] uppercase">Authenticating...</div>
        </div>
      ) : (
        <form onSubmit={onLogin} className="space-y-4 w-full max-w-sm">
          <div>
            <label className="text-xs text-[#9CA3AF] tracking-widest uppercase block mb-2">Email (optional for Supabase)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@devportfolio.io"
              className="w-full bg-black/40 border border-white/10 focus:border-[rgba(217,255,0,0.4)] rounded px-4 py-3 text-white text-sm font-mono placeholder-white/20 outline-none transition-colors" />
          </div>
          <div>
            <label className="text-xs text-[#9CA3AF] tracking-widest uppercase block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              className="w-full bg-black/40 border border-white/10 focus:border-[rgba(217,255,0,0.4)] rounded px-4 py-3 text-white text-sm font-mono placeholder-white/20 outline-none transition-colors" />
          </div>
          {authError && <p className="text-red-400 text-xs">{authError}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#D9FF00] text-black font-bold tracking-widest uppercase text-xs rounded hover:shadow-[0_0_20px_rgba(217,255,0,0.3)] transition-all duration-300 disabled:opacity-60">
            {loading ? "Verifying..." : "Enter Admin Panel →"}
          </button>
          <button type="button" onClick={onClose} className="w-full py-2 text-[#9CA3AF] text-xs tracking-widest hover:text-white transition-colors">Cancel</button>
        </form>
      )}
    </motion.div>
  );
}

function Dashboard({ data, activeTab, setActiveTab, updateData, onClose, onSignOut, supabaseMode, syncToSupabase }: {
  data: ReturnType<typeof loadLocalData>;
  activeTab: AdminTab; setActiveTab: (t: AdminTab) => void;
  updateData: (s: keyof ReturnType<typeof loadLocalData>, v: unknown) => void;
  onClose: () => void; onSignOut: () => void;
  supabaseMode: boolean; syncToSupabase: () => void;
}) {
  return (
    <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#080808] flex flex-col h-full font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#D9FF00] animate-pulse" />
          <span className="text-white text-sm font-bold tracking-widest hidden sm:block">ADMIN DASHBOARD</span>
          <span className="text-[#9CA3AF] text-xs border border-white/10 px-2 py-0.5 rounded">DEV.OS</span>
          {supabaseMode && <span className="text-[#D9FF00] text-[10px] border border-[rgba(217,255,0,0.3)] px-2 py-0.5 rounded">SUPABASE LIVE</span>}
        </div>
        <div className="flex items-center gap-2">
          {supabaseMode && (
            <button onClick={syncToSupabase} className="text-[#D9FF00] text-[10px] tracking-widest border border-[rgba(217,255,0,0.3)] px-2 py-1 rounded hover:bg-[rgba(217,255,0,0.08)] transition-colors">
              ↑ SYNC
            </button>
          )}
          <button onClick={() => { resetLocalData(); window.location.reload(); }}
            className="text-orange-400 text-[10px] tracking-widest border border-orange-400/20 px-2 py-1 rounded hover:bg-orange-400/10 transition-colors hidden sm:block">
            RESET
          </button>
          <button onClick={onSignOut} className="text-[#9CA3AF] hover:text-[#D9FF00] text-xs tracking-widest transition-colors hidden sm:block">Sign Out</button>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-white transition-colors p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-10 sm:w-36 border-r border-white/5 p-1 sm:p-3 overflow-y-auto terminal-scroll shrink-0">
          <div className="space-y-0.5">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-2 sm:px-3 py-2 rounded text-xs tracking-widest uppercase transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id ? "bg-[#D9FF00] text-black font-bold" : "text-[#9CA3AF] hover:text-white hover:bg-white/5"}`}>
                <span className="text-sm shrink-0">{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 terminal-scroll">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {activeTab === "hero" && <HeroEditor data={data.hero} onChange={v => updateData("hero", v)} />}
              {activeTab === "about" && <AboutEditor data={data.about} onChange={v => updateData("about", v)} />}
              {activeTab === "experience" && <ExperienceEditor data={data.about.experience} onChange={v => updateData("about", { ...data.about, experience: v })} />}
              {activeTab === "projects" && <ProjectsEditor data={data.projects} onChange={v => updateData("projects", v)} />}
              {activeTab === "skills" && <SkillsEditor data={data.skills} onChange={v => updateData("skills", v)} />}
              {activeTab === "contact" && <ContactEditor data={data.about} onChange={v => updateData("about", v)} />}
              {activeTab === "social" && <SocialEditor data={data.social} onChange={v => updateData("social", v)} />}
              {activeTab === "seo" && <SEOEditor />}
              {activeTab === "blog" && <BlogEditor />}
              {activeTab === "terminal" && <TerminalEditor />}
              {activeTab === "appearance" && <AppearanceEditor />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shared components ──────────────────────────────────────────────────────
function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1 h-5 bg-[#D9FF00] rounded-full" />
        <h3 className="text-white font-bold tracking-widest uppercase text-sm">{title}</h3>
      </div>
      {desc && <p className="text-[#9CA3AF] text-xs ml-4">{desc}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-[#9CA3AF] tracking-widest uppercase block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", className = "" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`w-full bg-black/40 border border-white/10 focus:border-[rgba(217,255,0,0.4)] rounded px-3 py-2.5 text-white text-xs font-mono placeholder-white/20 outline-none transition-colors ${className}`} />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full bg-black/40 border border-white/10 focus:border-[rgba(217,255,0,0.4)] rounded px-3 py-2.5 text-white text-xs font-mono placeholder-white/20 outline-none transition-colors resize-none" />
  );
}

function SaveBtn({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2.5 text-xs tracking-widest uppercase rounded font-bold transition-all duration-200 ${saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#D9FF00] text-black hover:shadow-[0_0_20px_rgba(217,255,0,0.3)]"}`}>
      {saved ? "✓ Saved!" : "Save Changes"}
    </button>
  );
}

function useSave(fn: () => void) {
  const [saved, setSaved] = useState(false);
  const save = () => { fn(); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return { saved, save };
}

// ─── Hero Editor ─────────────────────────────────────────────────────────────
function HeroEditor({ data, onChange }: { data: typeof defaultData.hero; onChange: (v: typeof defaultData.hero) => void }) {
  const [form, setForm] = useState(data);
  const update = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saved, save } = useSave(() => onChange(form));
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile("avatars", `avatar_${Date.now()}.${file.name.split(".").pop()}`, file);
      update("avatar")(url);
    } catch {
      const reader = new FileReader();
      reader.onload = ev => update("avatar")(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5">
      <SectionTitle title="Hero Section" desc="Edit your name, role, tagline and profile photo" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name"><Input value={form.name} onChange={update("name")} placeholder="Alex Chen" /></Field>
        <Field label="Primary Role"><Input value={form.role} onChange={update("role")} placeholder="Full Stack Developer" /></Field>
        <div className="sm:col-span-2">
          <Field label="Tagline (bold text)"><Input value={form.tagline} onChange={update("tagline")} placeholder="Building the future..." /></Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Subtitle (description below name)"><Textarea value={form.subtitle} onChange={update("subtitle")} placeholder="Crafting digital experiences..." rows={2} /></Field>
        </div>
        <Field label="CTA Button 1 Text"><Input value={form.ctaPrimary} onChange={update("ctaPrimary")} placeholder="View Projects" /></Field>
        <Field label="CTA Button 2 Text"><Input value={form.ctaSecondary} onChange={update("ctaSecondary")} placeholder="Open Terminal" /></Field>
        <div className="sm:col-span-2">
          <Field label="Profile Photo">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded border border-[rgba(217,255,0,0.3)] bg-black/40 flex items-center justify-center overflow-hidden shrink-0">
                {form.avatar ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
              </div>
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <button onClick={() => fileRef.current?.click()}
                  className="border border-dashed border-white/10 rounded p-3 text-center hover:border-[rgba(217,255,0,0.3)] transition-colors cursor-pointer w-full text-[#9CA3AF] text-xs">
                  Click to upload photo (PNG, JPG, WebP)
                </button>
                <div className="mt-1.5"><Input value={form.avatar} onChange={update("avatar")} placeholder="Or paste image URL" /></div>
              </div>
            </div>
          </Field>
        </div>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── About Editor ────────────────────────────────────────────────────────────
function AboutEditor({ data, onChange }: { data: typeof defaultData.about; onChange: (v: typeof defaultData.about) => void }) {
  const [form, setForm] = useState(data);
  const update = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saved, save } = useSave(() => onChange(form));

  const [stats, setStats] = useState(data.stats);
  const updateStat = (i: number, k: "label" | "value", v: string) => {
    const next = stats.map((s, j) => j === i ? { ...s, [k]: v } : s);
    setStats(next); setForm(p => ({ ...p, stats: next }));
  };
  const addStat = () => { setStats(p => [...p, { label: "New Stat", value: "0+" }]); };
  const removeStat = (i: number) => { setStats(p => p.filter((_, j) => j !== i)); };

  return (
    <div className="space-y-5">
      <SectionTitle title="About Section" desc="Your bio, location, availability and stats" />
      <div className="space-y-4">
        <Field label="Bio"><Textarea value={form.bio} onChange={update("bio")} placeholder="Tell your story..." rows={4} /></Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location"><Input value={form.location} onChange={update("location")} placeholder="San Francisco, CA" /></Field>
          <Field label="Email"><Input value={form.email} onChange={update("email")} placeholder="you@email.com" type="email" /></Field>
          <Field label="Availability Status"><Input value={form.availability} onChange={update("availability")} placeholder="Open to opportunities" /></Field>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-[#9CA3AF] tracking-widest uppercase">Stats Cards</label>
            <button onClick={addStat} className="text-[#D9FF00] text-[10px] tracking-widest border border-[rgba(217,255,0,0.3)] px-2 py-1 rounded hover:bg-[rgba(217,255,0,0.08)] transition-colors">+ Add Stat</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-center bg-black/20 rounded p-2 border border-white/5">
                <Input value={stat.value} onChange={v => updateStat(i, "value", v)} placeholder="5+" className="w-16" />
                <Input value={stat.label} onChange={v => updateStat(i, "label", v)} placeholder="Years Exp." />
                <button onClick={() => removeStat(i)} className="text-red-400/60 hover:text-red-400 transition-colors shrink-0">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Experience Editor ────────────────────────────────────────────────────────
function ExperienceEditor({ data, onChange }: { data: typeof defaultData.about.experience; onChange: (v: typeof defaultData.about.experience) => void }) {
  const [items, setItems] = useState(data);
  const { saved, save } = useSave(() => onChange(items));

  const update = (i: number, k: keyof typeof items[0], v: string) => {
    setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x));
  };
  const add = () => setItems(p => [...p, { year: "2024 — Now", role: "New Role", company: "Company", description: "Description" }]);
  const remove = (i: number) => setItems(p => p.filter((_, j) => j !== i));
  const moveUp = (i: number) => { if (i === 0) return; const n = [...items]; [n[i-1], n[i]] = [n[i], n[i-1]]; setItems(n); };
  const moveDown = (i: number) => { if (i === items.length-1) return; const n = [...items]; [n[i], n[i+1]] = [n[i+1], n[i]]; setItems(n); };

  return (
    <div className="space-y-5">
      <SectionTitle title="Experience Timeline" desc="Add, edit, remove and reorder work history" />
      <div className="space-y-4">
        {items.map((exp, i) => (
          <div key={i} className="bg-black/20 border border-white/5 rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#D9FF00] text-[10px] tracking-widest">#{i+1} — {exp.company}</span>
              <div className="flex gap-1">
                <button onClick={() => moveUp(i)} className="text-[#9CA3AF] hover:text-white text-xs px-1.5 py-0.5 border border-white/10 rounded transition-colors">↑</button>
                <button onClick={() => moveDown(i)} className="text-[#9CA3AF] hover:text-white text-xs px-1.5 py-0.5 border border-white/10 rounded transition-colors">↓</button>
                <button onClick={() => remove(i)} className="text-red-400/60 hover:text-red-400 text-xs px-1.5 py-0.5 border border-red-400/20 rounded transition-colors">Remove</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Year Range"><Input value={exp.year} onChange={v => update(i, "year", v)} placeholder="2023 — Now" /></Field>
              <Field label="Job Title"><Input value={exp.role} onChange={v => update(i, "role", v)} placeholder="Senior Developer" /></Field>
              <Field label="Company"><Input value={exp.company} onChange={v => update(i, "company", v)} placeholder="TechCorp Inc." /></Field>
              <div className="sm:col-span-3">
                <Field label="Description"><Textarea value={exp.description} onChange={v => update(i, "description", v)} placeholder="What you did there..." rows={2} /></Field>
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} className="w-full border border-dashed border-white/10 rounded p-3 text-[#9CA3AF] text-xs tracking-widest hover:border-[rgba(217,255,0,0.3)] hover:text-[#D9FF00] transition-all">
          + Add Experience
        </button>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Projects Editor ─────────────────────────────────────────────────────────
function ProjectsEditor({ data, onChange }: { data: typeof defaultData.projects; onChange: (v: typeof defaultData.projects) => void }) {
  const [items, setItems] = useState(data);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const { saved, save } = useSave(() => onChange(items));
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (i: number, k: string, v: unknown) => setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const updateTags = (i: number, v: string) => update(i, "tags", v.split(",").map(t => t.trim()).filter(Boolean));
  const add = () => { setItems(p => [...p, { id: Date.now(), title: "New Project", description: "", tags: [], image: "", github: "", live: "", category: "Other", featured: false }]); setEditIdx(items.length); };
  const remove = (i: number) => { setItems(p => p.filter((_, j) => j !== i)); if (editIdx === i) setEditIdx(null); };

  const handleImageUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile("projects", `proj_${Date.now()}.${file.name.split(".").pop()}`, file);
      update(i, "image", url);
    } catch {
      const reader = new FileReader();
      reader.onload = ev => update(i, "image", ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Projects" desc="Manage all your portfolio projects" />
      <div className="space-y-3">
        {items.map((proj, i) => (
          <div key={proj.id} className="bg-black/20 border border-white/5 rounded overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors" onClick={() => setEditIdx(editIdx === i ? null : i)}>
              <div className="flex items-center gap-3">
                <span className="text-[#D9FF00] text-[10px] tracking-widest">[{String(i+1).padStart(2,"0")}]</span>
                <span className="text-white text-xs font-bold">{proj.title}</span>
                <span className="text-[#9CA3AF] text-[10px] border border-white/10 px-1.5 py-0.5 rounded">{proj.category}</span>
                {proj.featured && <span className="text-[10px] bg-[#D9FF00] text-black px-1.5 py-0.5 rounded font-bold">FEATURED</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={e => { e.stopPropagation(); remove(i); }} className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest transition-colors">Remove</button>
                <span className="text-[#9CA3AF] text-xs">{editIdx === i ? "▲" : "▼"}</span>
              </div>
            </div>
            {editIdx === i && (
              <div className="p-4 border-t border-white/5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Project Title"><Input value={proj.title} onChange={v => update(i, "title", v)} placeholder="My Project" /></Field>
                  <Field label="Category"><Input value={proj.category} onChange={v => update(i, "category", v)} placeholder="AI, Backend, Creative..." /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Description"><Textarea value={proj.description} onChange={v => update(i, "description", v)} placeholder="What this project does..." rows={3} /></Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Tech Tags (comma separated)"><Input value={proj.tags.join(", ")} onChange={v => updateTags(i, v)} placeholder="React, Node.js, Python" /></Field>
                  </div>
                  <Field label="GitHub URL"><Input value={proj.github} onChange={v => update(i, "github", v)} placeholder="https://github.com/..." /></Field>
                  <Field label="Live Demo URL"><Input value={proj.live} onChange={v => update(i, "live", v)} placeholder="https://..." /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Project Image">
                      <div className="flex gap-2 items-start">
                        <div className="w-16 h-12 rounded border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden shrink-0">
                          {proj.image ? <img src={proj.image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">🖼️</span>}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(i, e)} className="hidden" id={`proj-img-${i}`} />
                          <label htmlFor={`proj-img-${i}`} className="block border border-dashed border-white/10 rounded p-2 text-center hover:border-[rgba(217,255,0,0.3)] transition-colors cursor-pointer text-[#9CA3AF] text-[10px]">Upload Image</label>
                          <Input value={proj.image} onChange={v => update(i, "image", v)} placeholder="Or paste image URL" />
                        </div>
                      </div>
                    </Field>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={proj.featured} onChange={e => update(i, "featured", e.target.checked)} className="accent-[#D9FF00]" />
                      <span className="text-xs text-[#9CA3AF] tracking-widest uppercase">Featured Project</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <button onClick={add} className="w-full border border-dashed border-white/10 rounded p-3 text-[#9CA3AF] text-xs tracking-widest hover:border-[rgba(217,255,0,0.3)] hover:text-[#D9FF00] transition-all">
          + Add New Project
        </button>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Skills Editor ─────────────────────────────────────────────────────────
function SkillsEditor({ data, onChange }: { data: typeof defaultData.skills; onChange: (v: typeof defaultData.skills) => void }) {
  const [items, setItems] = useState(data);
  const [newName, setNewName] = useState(""); const [newCat, setNewCat] = useState(""); const [newIcon, setNewIcon] = useState("💡");
  const { saved, save } = useSave(() => onChange(items));

  const update = (i: number, k: keyof typeof items[0], v: string) => setItems(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const remove = (i: number) => setItems(p => p.filter((_, j) => j !== i));
  const add = () => {
    if (!newName.trim()) return;
    setItems(p => [...p, { name: newName.trim(), category: newCat || "Other", icon: newIcon || "💡" }]);
    setNewName(""); setNewCat(""); setNewIcon("💡");
  };

  return (
    <div className="space-y-5">
      <SectionTitle title="Skills" desc="Manage your tech stack — add, edit or remove skills" />
      <div className="grid grid-cols-1 gap-2">
        {items.map((skill, i) => (
          <div key={i} className="flex items-center gap-2 bg-black/20 border border-white/5 rounded px-3 py-2">
            <input value={skill.icon} onChange={e => update(i, "icon", e.target.value)} placeholder="💡"
              className="w-8 text-center bg-transparent text-white outline-none text-sm" />
            <input value={skill.name} onChange={e => update(i, "name", e.target.value)} placeholder="Skill name"
              className="flex-1 bg-transparent text-white text-xs font-mono outline-none placeholder-white/20" />
            <input value={skill.category} onChange={e => update(i, "category", e.target.value)} placeholder="Category"
              className="w-24 bg-transparent text-[#9CA3AF] text-[10px] font-mono outline-none placeholder-white/20" />
            <button onClick={() => remove(i)} className="text-red-400/50 hover:text-red-400 transition-colors shrink-0 text-xs">×</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center bg-black/30 border border-[rgba(217,255,0,0.2)] rounded p-3">
        <input value={newIcon} onChange={e => setNewIcon(e.target.value)} placeholder="💡"
          className="w-8 text-center bg-transparent text-white outline-none text-sm border-r border-white/10 pr-2" />
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Skill name..."
          className="flex-1 bg-transparent text-white text-xs font-mono outline-none placeholder-white/20" />
        <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Category"
          className="w-24 bg-transparent text-[#9CA3AF] text-[10px] font-mono outline-none placeholder-white/20 border-l border-white/10 pl-2" />
        <button onClick={add} className="bg-[#D9FF00] text-black text-[10px] font-bold px-3 py-1.5 rounded tracking-widest shrink-0">ADD</button>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Contact Editor ──────────────────────────────────────────────────────────
function ContactEditor({ data, onChange }: { data: typeof defaultData.about; onChange: (v: typeof defaultData.about) => void }) {
  const [form, setForm] = useState({ email: data.email, location: data.location, availability: data.availability });
  const update = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const [resumeUrl, setResumeUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { saved, save } = useSave(() => onChange({ ...data, ...form }));

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile("resume", `resume_${Date.now()}.pdf`, file);
      setResumeUrl(url);
    } catch { alert("Upload requires Supabase storage. Paste URL instead."); }
  };

  return (
    <div className="space-y-5">
      <SectionTitle title="Contact Information" desc="Manage your public contact details" />
      <div className="space-y-4">
        <Field label="Contact Email"><Input value={form.email} onChange={update("email")} placeholder="you@email.com" type="email" /></Field>
        <Field label="Location / City"><Input value={form.location} onChange={update("location")} placeholder="San Francisco, CA" /></Field>
        <Field label="Availability Status"><Input value={form.availability} onChange={update("availability")} placeholder="Open to opportunities" /></Field>
        <div>
          <Field label="Resume PDF">
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
            <div className="space-y-2">
              <button onClick={() => fileRef.current?.click()} className="border border-dashed border-white/10 rounded p-3 text-center hover:border-[rgba(217,255,0,0.3)] transition-colors cursor-pointer w-full text-[#9CA3AF] text-xs">
                Upload Resume PDF
              </button>
              <Input value={resumeUrl} onChange={setResumeUrl} placeholder="Or paste resume URL" />
              {resumeUrl && <p className="text-[#D9FF00] text-[10px]">✓ Resume URL set: {resumeUrl.slice(0, 50)}...</p>}
            </div>
          </Field>
        </div>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Social Links Editor ──────────────────────────────────────────────────────
function SocialEditor({ data, onChange }: { data: typeof defaultData.social; onChange: (v: typeof defaultData.social) => void }) {
  const [form, setForm] = useState(data);
  const update = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saved, save } = useSave(() => onChange(form));

  const links = [
    { key: "github" as const, label: "GitHub", placeholder: "https://github.com/username", icon: "⚙️" },
    { key: "linkedin" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/username", icon: "💼" },
    { key: "twitter" as const, label: "Twitter / X", placeholder: "https://twitter.com/username", icon: "🐦" },
    { key: "email" as const, label: "Email Address", placeholder: "you@email.com", icon: "✉️" },
  ];

  return (
    <div className="space-y-5">
      <SectionTitle title="Social Links" desc="Update all your social media and contact links" />
      <div className="space-y-3">
        {links.map(l => (
          <div key={l.key} className="flex items-center gap-3">
            <span className="text-lg w-7 shrink-0">{l.icon}</span>
            <div className="flex-1">
              <label className="text-[10px] text-[#9CA3AF] tracking-widest uppercase block mb-1">{l.label}</label>
              <Input value={form[l.key]} onChange={update(l.key)} placeholder={l.placeholder} />
            </div>
          </div>
        ))}
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── SEO Editor ──────────────────────────────────────────────────────────────
function SEOEditor() {
  const [form, setForm] = useState({ title: "DEV.OS — Futuristic Portfolio", description: "A premium futuristic developer portfolio", keywords: "developer, portfolio, react, nextjs", ogImage: "" });
  const update = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const { saved, save } = useSave(() => saveLocalData({ seo: form } as never));

  return (
    <div className="space-y-5">
      <SectionTitle title="SEO & Meta Tags" desc="Control how your portfolio appears in search engines" />
      <div className="space-y-4">
        <Field label="Page Title"><Input value={form.title} onChange={update("title")} placeholder="Your Name — Developer Portfolio" /></Field>
        <Field label="Meta Description"><Textarea value={form.description} onChange={update("description")} placeholder="A short description of your portfolio..." rows={3} /></Field>
        <Field label="Keywords (comma separated)"><Input value={form.keywords} onChange={update("keywords")} placeholder="developer, react, typescript, portfolio" /></Field>
        <Field label="OG Image URL"><Input value={form.ogImage} onChange={update("ogImage")} placeholder="https://..." /></Field>
        <div className="bg-black/20 border border-white/5 rounded p-4">
          <div className="text-[#D9FF00] text-xs mb-2 tracking-widest">PREVIEW — Google Search Result</div>
          <div className="space-y-1">
            <div className="text-blue-400 text-sm font-medium">{form.title || "Your Portfolio"}</div>
            <div className="text-green-400 text-[10px]">https://yourportfolio.replit.app</div>
            <div className="text-[#9CA3AF] text-xs">{form.description || "Description will appear here..."}</div>
          </div>
        </div>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Blog Editor ─────────────────────────────────────────────────────────────
function BlogEditor() {
  const [posts, setPosts] = useState([
    { id: "1", title: "Building a Real-Time Editor with CRDT", content: "", excerpt: "", status: "draft", tags: "react, webdev", created_at: "2026-05-01" },
    { id: "2", title: "The Future of WebGL: Beyond Three.js", content: "", excerpt: "", status: "draft", tags: "webgl, threejs", created_at: "2026-04-20" },
  ]);
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const editingPost = posts.find(p => p.id === editId);

  const updatePost = (k: string, v: string) => setPosts(prev => prev.map(p => p.id === editId ? { ...p, [k]: v } : p));
  const addPost = () => {
    const id = String(Date.now());
    setPosts(p => [...p, { id, title: "New Post", content: "", excerpt: "", status: "draft", tags: "", created_at: new Date().toISOString().split("T")[0] }]);
    setEditId(id);
  };
  const removePost = (id: string) => { setPosts(p => p.filter(x => x.id !== id)); if (editId === id) setEditId(null); };
  const publish = (id: string) => setPosts(p => p.map(x => x.id === id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x));

  return (
    <div className="space-y-5">
      <SectionTitle title="Blog Posts" desc="Create and manage blog posts" />
      {editingPost ? (
        <div className="space-y-4">
          <button onClick={() => setEditId(null)} className="text-[#9CA3AF] text-xs tracking-widest flex items-center gap-1 hover:text-white transition-colors">← Back to Posts</button>
          <Field label="Post Title"><Input value={editingPost.title} onChange={v => updatePost("title", v)} placeholder="Post title..." /></Field>
          <Field label="Excerpt (short summary)"><Textarea value={editingPost.excerpt} onChange={v => updatePost("excerpt", v)} placeholder="A brief summary..." rows={2} /></Field>
          <Field label="Tags (comma separated)"><Input value={editingPost.tags} onChange={v => updatePost("tags", v)} placeholder="react, typescript, web" /></Field>
          <Field label="Content (Markdown supported)"><Textarea value={editingPost.content} onChange={v => updatePost("content", v)} placeholder="Write your post here..." rows={12} /></Field>
          <div className="flex gap-3">
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase rounded font-bold transition-all ${saved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#D9FF00] text-black"}`}>
              {saved ? "✓ Saved!" : "Save Draft"}
            </button>
            <button onClick={() => publish(editingPost.id)}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase rounded font-bold border transition-all ${editingPost.status === "published" ? "text-orange-400 border-orange-400/30 hover:bg-orange-400/10" : "text-green-400 border-green-400/30 hover:bg-green-400/10"}`}>
              {editingPost.status === "published" ? "Unpublish" : "Publish →"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="glass neon-border rounded p-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold truncate">{post.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${post.status === "published" ? "text-green-400 bg-green-400/10" : "text-[#9CA3AF] bg-white/5"}`}>{post.status}</span>
                  <span className="text-[#9CA3AF] text-[10px]">{post.created_at}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditId(post.id)} className="text-[#D9FF00] text-[10px] tracking-widest border border-[rgba(217,255,0,0.3)] px-2 py-1 rounded hover:bg-[rgba(217,255,0,0.08)] transition-colors">EDIT</button>
                <button onClick={() => publish(post.id)} className={`text-[10px] tracking-widest border px-2 py-1 rounded transition-colors ${post.status === "published" ? "text-orange-400 border-orange-400/30 hover:bg-orange-400/10" : "text-green-400 border-green-400/30 hover:bg-green-400/10"}`}>
                  {post.status === "published" ? "UNPUBLISH" : "PUBLISH"}
                </button>
                <button onClick={() => removePost(post.id)} className="text-red-400/60 hover:text-red-400 text-[10px] tracking-widest transition-colors px-1">✕</button>
              </div>
            </div>
          ))}
          <button onClick={addPost} className="w-full border border-dashed border-white/10 rounded p-3 text-[#9CA3AF] text-xs tracking-widest hover:border-[rgba(217,255,0,0.3)] hover:text-[#D9FF00] transition-all">
            + New Post
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Terminal Config ──────────────────────────────────────────────────────────
function TerminalEditor() {
  const [adminPwd, setAdminPwd] = useState("9950");
  const [welcomeMsg, setWelcomeMsg] = useState("DEV.OS Terminal v2.0.26");
  const [customCmds, setCustomCmds] = useState([{ command: "hire.me", response: "Opening email client..." }]);
  const { saved, save } = useSave(() => saveLocalData({ terminal: { adminPassword: adminPwd, welcomeMsg, customCommands: customCmds } } as never));

  const addCmd = () => setCustomCmds(p => [...p, { command: "", response: "" }]);
  const updateCmd = (i: number, k: "command" | "response", v: string) => setCustomCmds(p => p.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const removeCmd = (i: number) => setCustomCmds(p => p.filter((_, j) => j !== i));

  return (
    <div className="space-y-5">
      <SectionTitle title="Terminal Config" desc="Configure the interactive terminal section" />
      <div className="space-y-4">
        <Field label="Admin Panel Password">
          <Input value={adminPwd} onChange={setAdminPwd} placeholder="9950" type="password" />
          <p className="text-[#9CA3AF] text-[10px] mt-1">Password to enter the admin panel via awaken.system command</p>
        </Field>
        <Field label="Terminal Welcome Message"><Input value={welcomeMsg} onChange={setWelcomeMsg} placeholder="DEV.OS Terminal" /></Field>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-[#9CA3AF] tracking-widest uppercase">Custom Commands</label>
            <button onClick={addCmd} className="text-[#D9FF00] text-[10px] tracking-widest border border-[rgba(217,255,0,0.3)] px-2 py-1 rounded hover:bg-[rgba(217,255,0,0.08)]">+ Add</button>
          </div>
          <div className="space-y-2">
            {customCmds.map((cmd, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input value={cmd.command} onChange={v => updateCmd(i, "command", v)} placeholder="command" />
                <span className="text-[#9CA3AF] text-xs shrink-0">→</span>
                <Input value={cmd.response} onChange={v => updateCmd(i, "response", v)} placeholder="Response text" />
                <button onClick={() => removeCmd(i)} className="text-red-400/60 hover:text-red-400 transition-colors shrink-0">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── Appearance / Settings ────────────────────────────────────────────────────
function AppearanceEditor() {
  const [accentColor, setAccentColor] = useState("#D9FF00");
  const [bgColor, setBgColor] = useState("#050505");
  const [fontStyle, setFontStyle] = useState("inter");
  const { saved, save } = useSave(() => saveLocalData({ appearance: { accentColor, bgColor, fontStyle } } as never));

  return (
    <div className="space-y-5">
      <SectionTitle title="Appearance & Settings" desc="Customize colors and visual settings" />
      <div className="space-y-4">
        <Field label="Accent / Neon Color">
          <div className="flex gap-3 items-center">
            <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
            <Input value={accentColor} onChange={setAccentColor} placeholder="#D9FF00" className="flex-1" />
          </div>
        </Field>
        <Field label="Background Color">
          <div className="flex gap-3 items-center">
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
            <Input value={bgColor} onChange={setBgColor} placeholder="#050505" className="flex-1" />
          </div>
        </Field>
        <Field label="Font Style">
          <select value={fontStyle} onChange={e => setFontStyle(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-[rgba(217,255,0,0.4)] rounded px-3 py-2.5 text-white text-xs font-mono outline-none">
            <option value="inter">Inter (Default)</option>
            <option value="mono">Monospace</option>
            <option value="space">Space Grotesk</option>
          </select>
        </Field>
        <div className="bg-black/20 border border-white/5 rounded p-4">
          <div className="text-[#9CA3AF] text-[10px] tracking-widest uppercase mb-3">Supabase Setup Guide</div>
          <div className="space-y-2 text-[10px] text-[#9CA3AF]">
            <p>1. Create a Supabase project at supabase.com</p>
            <p>2. Run the SQL from <span className="text-[#D9FF00]">supabase/schema.sql</span></p>
            <p>3. Add secrets in Replit Secrets tab:</p>
            <div className="bg-black/40 rounded p-2 font-mono text-[#D9FF00] space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            </div>
            <p>4. Log in with your Supabase user email/password</p>
          </div>
        </div>
        <div className="bg-black/20 border border-white/5 rounded p-4 space-y-3">
          <div className="text-[#9CA3AF] text-[10px] tracking-widest uppercase">Data Management</div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { const d = loadLocalData(); navigator.clipboard.writeText(JSON.stringify(d, null, 2)); }}
              className="text-[#9CA3AF] text-[10px] tracking-widest border border-white/10 px-3 py-2 rounded hover:text-white transition-colors">
              Export JSON
            </button>
            <button onClick={() => saveLocalData(defaultData)}
              className="text-[#D9FF00] text-[10px] tracking-widest border border-[rgba(217,255,0,0.3)] px-3 py-2 rounded hover:bg-[rgba(217,255,0,0.08)] transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}
