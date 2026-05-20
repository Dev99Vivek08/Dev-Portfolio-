"use client";
import { useState } from "react";
import { loadAdminData, saveAdminData, resetAdminData } from "@/lib/admin-store";
import type { ThemeSettings, SEOSettings, PerformanceSettings, SectionConfig, ContactSettings } from "@/lib/admin-types";
import { AdminCard, Field, Input, Textarea, Toggle, Btn, ColorInput, Slider, PageWrap, PageHeader, SaveBar, toast, ToastProvider, Divider, Modal } from "@/components/admin/AdminUI";
import { Reorder, motion } from "framer-motion";

type Tab = "theme" | "seo" | "performance" | "sections" | "contact" | "danger";

export default function SettingsPage() {
  const initial = loadAdminData();
  const [theme, setTheme] = useState<ThemeSettings>(() => initial.theme);
  const [seo, setSeo] = useState<SEOSettings>(() => initial.seo);
  const [perf, setPerf] = useState<PerformanceSettings>(() => initial.performance);
  const [sections, setSections] = useState<SectionConfig[]>(() => [...initial.sections].sort((a, b) => a.sortOrder - b.sortOrder));
  const [contact, setContact] = useState<ContactSettings>(() => initial.contact);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("theme");
  const [showReset, setShowReset] = useState(false);

  const markDirty = () => setDirty(true);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    saveAdminData({ theme, seo, performance: perf, sections, contact });
    setSaving(false);
    setDirty(false);
    toast("Settings saved!", "ok");
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "theme", label: "Theme" },
    { id: "seo", label: "SEO" },
    { id: "performance", label: "Performance" },
    { id: "sections", label: "Sections" },
    { id: "contact", label: "Contact & Social" },
    { id: "danger", label: "Danger Zone" },
  ];

  const PRESET_ACCENTS = ["#D9FF00","#00FF88","#00D4FF","#FF6B35","#FF3B9A","#A855F7","#FFD700","#FF4040"];

  return (
    <PageWrap>
      <ToastProvider />
      <PageHeader title="Settings" desc="Theme, SEO, performance and more"
        actions={<Btn onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Btn>} />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 bg-[#0a0a0a] border border-[rgba(255,255,255,0.04)] rounded-xl flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 rounded-lg text-xs font-mono tracking-wide transition-all ${activeTab === t.id ? (t.id === "danger" ? "bg-red-500/20 text-red-400" : "bg-[#D9FF00] text-black font-bold") : "text-[#6b7280] hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Theme */}
      {activeTab === "theme" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <AdminCard title="Colors" desc="Primary accent and background colors">
            <div className="space-y-5">
              <div>
                <Field label="Accent Color">
                  <ColorInput value={theme.accentColor} onChange={v => { setTheme(t => ({ ...t, accentColor: v })); markDirty(); }} />
                </Field>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {PRESET_ACCENTS.map(c => (
                    <button key={c} onClick={() => { setTheme(t => ({ ...t, accentColor: c })); markDirty(); }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${theme.accentColor === c ? "border-white scale-110" : "border-transparent hover:scale-105"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
              <Field label="Background Color">
                <ColorInput value={theme.bgColor} onChange={v => { setTheme(t => ({ ...t, bgColor: v })); markDirty(); }} />
              </Field>
              <Slider value={theme.glowIntensity} onChange={v => { setTheme(t => ({ ...t, glowIntensity: v })); markDirty(); }}
                label="Glow Intensity" min={0} max={100} />
            </div>
          </AdminCard>

          {/* Live color preview */}
          <AdminCard title="Live Preview" desc="How your colors look">
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] p-6 text-center"
              style={{ background: theme.bgColor }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
                style={{ borderColor: theme.accentColor + "33", background: theme.accentColor + "10" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accentColor }} />
                <span className="font-mono text-xs" style={{ color: theme.accentColor }}>Available for work</span>
              </div>
              <div className="text-3xl font-black text-white mb-2">
                John <span style={{ color: theme.accentColor }}>Doe</span>
              </div>
              <div className="text-[#9ca3af] text-sm mb-4">Full Stack Developer</div>
              <div className="flex justify-center gap-2">
                <span className="px-4 py-2 rounded-lg text-sm font-bold text-black" style={{ background: theme.accentColor }}>View Projects</span>
                <span className="px-4 py-2 rounded-lg text-sm text-white border border-[rgba(255,255,255,0.15)]">Terminal</span>
              </div>
              <div className="mt-4 text-[#4b5563] text-[11px]" style={{ filter: `drop-shadow(0 0 ${theme.glowIntensity / 5}px ${theme.accentColor})` }}>
                ✦ Glow intensity: {theme.glowIntensity}
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* SEO */}
      {activeTab === "seo" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <AdminCard title="Page Metadata" desc="How your site appears in search results">
            <div className="space-y-4">
              <Field label="Page Title" hint="50-60 chars ideal">
                <Input value={seo.title} onChange={v => { setSeo(s => ({ ...s, title: v })); markDirty(); }} placeholder="Name — Role" />
                <div className="text-[#4b5563] text-[10px] font-mono mt-1">{seo.title.length} chars</div>
              </Field>
              <Field label="Meta Description" hint="150-160 chars ideal">
                <Textarea value={seo.description} onChange={v => { setSeo(s => ({ ...s, description: v })); markDirty(); }} rows={3} placeholder="Brief description of your portfolio..." />
                <div className={`text-[10px] font-mono mt-1 ${seo.description.length > 160 ? "text-red-400" : "text-[#4b5563]"}`}>{seo.description.length} chars</div>
              </Field>
              <Field label="Keywords" hint="Comma-separated">
                <Input value={seo.keywords} onChange={v => { setSeo(s => ({ ...s, keywords: v })); markDirty(); }} placeholder="developer, react, typescript..." mono />
              </Field>
              <Field label="OG Image URL" hint="1200×630 recommended">
                <Input value={seo.ogImage} onChange={v => { setSeo(s => ({ ...s, ogImage: v })); markDirty(); }} placeholder="https://..." mono />
              </Field>
            </div>
          </AdminCard>

          {/* SEO preview */}
          <AdminCard title="Google Preview" desc="How your site appears in search results">
            <div className="bg-white rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#D9FF00] flex-shrink-0" />
                <div>
                  <div className="text-[#1a0dab] text-sm font-medium leading-tight hover:underline cursor-pointer">{seo.title || "Page Title"}</div>
                  <div className="text-[#006621] text-xs">yourname.dev</div>
                </div>
              </div>
              <div className="text-[#545454] text-xs leading-relaxed line-clamp-3">{seo.description || "Your meta description will appear here."}</div>
            </div>
            <div className="mt-4">
              <div className="font-mono text-[10px] text-[#6b7280] tracking-widest uppercase mb-2">Twitter Card Preview</div>
              <div className="bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
                {seo.ogImage ? (
                  <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${seo.ogImage})` }} />
                ) : (
                  <div className="h-28 bg-[#0a0a0a] flex items-center justify-center text-[#374151] text-sm font-mono">No OG image set</div>
                )}
                <div className="p-3">
                  <div className="text-white text-xs font-semibold">{seo.title || "Page Title"}</div>
                  <div className="text-[#6b7280] text-[11px] mt-0.5 line-clamp-2">{seo.description}</div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Performance */}
      {activeTab === "performance" && (
        <AdminCard title="Performance & Effects" desc="Toggle visual effects to control performance">
          <div className="space-y-4 max-w-lg">
            {[
              { key: "particlesEnabled" as const, label: "3D Particle Field", desc: "Animated particles in the hero section — high GPU usage" },
              { key: "cursorEnabled" as const, label: "Custom Cursor", desc: "Neon cursor with trail effect" },
              { key: "animationsEnabled" as const, label: "Scroll Animations", desc: "Framer Motion entrance animations on all sections" },
              { key: "matrixAvailable" as const, label: "Matrix Rain Effect", desc: "Allow matrix rain via terminal command" },
            ].map(({ key, label, desc }) => (
              <div key={key}>
                <Toggle checked={perf[key]} onChange={v => { setPerf(p => ({ ...p, [key]: v })); markDirty(); }} label={label} desc={desc} />
                <Divider />
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Sections */}
      {activeTab === "sections" && (
        <AdminCard title="Section Visibility & Order" desc="Toggle sections and drag to reorder them">
          <Reorder.Group axis="y" values={sections} onReorder={s => { setSections(s.map((x, i) => ({ ...x, sortOrder: i }))); markDirty(); }} className="space-y-2">
            {sections.map(s => (
              <Reorder.Item key={s.id} value={s}>
                <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-[rgba(255,255,255,0.08)] transition-all group">
                  <div className="cursor-grab active:cursor-grabbing text-[#4b5563] hover:text-[#D9FF00] transition-colors px-1 select-none">⠿</div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{s.label}</div>
                    <div className="text-[#374151] text-[10px] font-mono">#{s.id}</div>
                  </div>
                  <Toggle checked={s.visible} onChange={v => { setSections(ss => ss.map(x => x.id === s.id ? { ...x, visible: v } : x)); markDirty(); }} />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </AdminCard>
      )}

      {/* Contact */}
      {activeTab === "contact" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <AdminCard title="Contact Information" desc="Displayed in the about and contact sections">
            <div className="space-y-4">
              <Field label="Email"><Input value={contact.email} onChange={v => { setContact(c => ({ ...c, email: v })); markDirty(); }} type="email" placeholder="you@domain.com" /></Field>
              <Field label="Location"><Input value={contact.location} onChange={v => { setContact(c => ({ ...c, location: v })); markDirty(); }} placeholder="San Francisco, CA" /></Field>
              <Field label="Phone (optional)"><Input value={contact.phone} onChange={v => { setContact(c => ({ ...c, phone: v })); markDirty(); }} placeholder="+1 (555) 000-0000" /></Field>
              <Field label="Resume / CV URL"><Input value={contact.resumeUrl} onChange={v => { setContact(c => ({ ...c, resumeUrl: v })); markDirty(); }} placeholder="https://drive.google.com/..." mono /></Field>
              <Field label="Footer Tagline"><Input value={contact.footerText} onChange={v => { setContact(c => ({ ...c, footerText: v })); markDirty(); }} placeholder="Building digital experiences..." /></Field>
            </div>
          </AdminCard>
          <AdminCard title="Social Links" desc="Your social media and professional profiles">
            <div className="space-y-4">
              <Field label="GitHub URL"><Input value={contact.github} onChange={v => { setContact(c => ({ ...c, github: v })); markDirty(); }} placeholder="https://github.com/..." mono /></Field>
              <Field label="Twitter / X URL"><Input value={contact.twitter} onChange={v => { setContact(c => ({ ...c, twitter: v })); markDirty(); }} placeholder="https://twitter.com/..." mono /></Field>
              <Field label="LinkedIn URL"><Input value={contact.linkedin} onChange={v => { setContact(c => ({ ...c, linkedin: v })); markDirty(); }} placeholder="https://linkedin.com/in/..." mono /></Field>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Danger Zone */}
      {activeTab === "danger" && (
        <AdminCard title="Danger Zone" desc="Irreversible actions — proceed carefully">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[rgba(239,68,68,0.15)] rounded-xl bg-[rgba(239,68,68,0.03)]">
              <div>
                <div className="text-white text-sm font-semibold">Reset All Data</div>
                <div className="text-[#6b7280] text-xs mt-0.5">Wipe all content and revert to default portfolio data</div>
              </div>
              <Btn variant="danger" onClick={() => setShowReset(true)}>Reset Everything</Btn>
            </div>
            <div className="flex items-center justify-between p-4 border border-[rgba(239,68,68,0.15)] rounded-xl bg-[rgba(239,68,68,0.03)]">
              <div>
                <div className="text-white text-sm font-semibold">Clear Messages</div>
                <div className="text-[#6b7280] text-xs mt-0.5">Delete all contact form submissions permanently</div>
              </div>
              <Btn variant="danger" onClick={() => { saveAdminData({ messages: [] }); toast("Messages cleared", "warn"); }}>Clear Messages</Btn>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Reset confirm */}
      <Modal open={showReset} onClose={() => setShowReset(false)} title="⚠ Reset All Data"
        footer={<><Btn variant="ghost" onClick={() => setShowReset(false)}>Cancel</Btn><Btn variant="danger" onClick={() => { resetAdminData(); toast("Data reset to defaults", "warn"); setShowReset(false); window.location.reload(); }}>Yes, Reset Everything</Btn></>}>
        <p className="text-[#9ca3af] text-sm">This will permanently wipe all your custom content (hero, projects, skills, experience, terminal commands, settings) and restore the default demo data. This action cannot be undone.</p>
      </Modal>

      <SaveBar dirty={dirty} loading={saving} onSave={save} />
    </PageWrap>
  );
}
