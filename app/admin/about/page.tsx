"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { AboutData, AboutStat } from "@/lib/admin-types";
import { AdminCard, Field, Input, Textarea, Btn, PageWrap, PageHeader, SaveBar, toast, ToastProvider } from "@/components/admin/AdminUI";

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData>(() => loadAdminData().about);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof AboutData>(key: K, value: AboutData[K]) => {
    setAbout(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateStat = (i: number, field: keyof AboutStat, value: string) => {
    const stats = about.stats.map((s, j) => j === i ? { ...s, [field]: value } : s);
    update("stats", stats);
  };

  const addStat = () => update("stats", [...about.stats, { label: "New Stat", value: "0" }]);

  const removeStat = (i: number) => update("stats", about.stats.filter((_, j) => j !== i));

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    saveAdminData({ about });
    setSaving(false);
    setDirty(false);
    toast("About section saved!", "ok");
  };

  const reset = () => { setAbout(loadAdminData().about); setDirty(false); };

  return (
    <PageWrap>
      <ToastProvider />
      <PageHeader title="About Section" desc="Edit your bio, contact info and stats"
        actions={<><Btn variant="ghost" onClick={reset}>Reset</Btn><Btn onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn></>} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bio */}
        <AdminCard title="Biography" desc="Your main intro text">
          <div className="space-y-4">
            <Field label="Bio Text" required>
              <Textarea value={about.bio} onChange={v => update("bio", v)} rows={6} placeholder="I'm a passionate developer..." />
            </Field>
            <Field label="Availability Status">
              <Input value={about.availabilityStatus} onChange={v => update("availabilityStatus", v)} placeholder="Open to opportunities" />
            </Field>
          </div>
        </AdminCard>

        {/* Contact Info */}
        <AdminCard title="Contact Details" desc="Location and email shown in the about section">
          <div className="space-y-4">
            <Field label="Location">
              <Input value={about.location} onChange={v => update("location", v)} placeholder="San Francisco, CA" />
            </Field>
            <Field label="Email Address">
              <Input value={about.email} onChange={v => update("email", v)} placeholder="you@example.com" type="email" />
            </Field>
          </div>
        </AdminCard>

        {/* Stats */}
        <AdminCard title="Stats Cards" desc="The 4 metric cards shown in the about section"
          className="lg:col-span-2"
          action={<Btn size="sm" onClick={addStat}>+ Add Stat</Btn>}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {about.stats.map((stat, i) => (
              <motion.div key={i} layout
                className="relative p-4 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-xl group">
                <button onClick={() => removeStat(i)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-[#6b7280] hover:text-red-400 transition-all text-xs">×</button>
                <div className="space-y-2">
                  <div>
                    <div className="font-mono text-[9px] text-[#6b7280] mb-1">VALUE</div>
                    <input value={stat.value} onChange={e => updateStat(i, "value", e.target.value)}
                      className="w-full text-[#D9FF00] font-mono font-bold text-xl bg-transparent outline-none border-b border-[rgba(217,255,0,0.1)] focus:border-[rgba(217,255,0,0.4)] pb-1 transition-colors" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-[#6b7280] mb-1">LABEL</div>
                    <input value={stat.label} onChange={e => updateStat(i, "label", e.target.value)}
                      className="w-full text-[#9ca3af] text-xs bg-transparent outline-none border-b border-[rgba(255,255,255,0.05)] focus:border-[rgba(255,255,255,0.15)] pb-1 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AdminCard>

        {/* Preview */}
        <AdminCard title="Preview" desc="How the about section looks" className="lg:col-span-2">
          <div className="bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-[#D9FF00] rounded-full" />
              <div className="font-mono text-[#D9FF00] text-[11px] tracking-widest uppercase">About</div>
            </div>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-4 max-w-2xl line-clamp-3">{about.bio}</p>
            <div className="flex items-center gap-4 text-xs text-[#6b7280] font-mono mb-4">
              <span>📍 {about.location}</span>
              <span>✉ {about.email}</span>
              <span>◉ {about.availabilityStatus}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {about.stats.map((s, i) => (
                <div key={i} className="text-center p-3 bg-[rgba(217,255,0,0.03)] border border-[rgba(217,255,0,0.08)] rounded-lg">
                  <div className="text-[#D9FF00] font-mono font-bold text-lg">{s.value}</div>
                  <div className="text-[#6b7280] text-[10px] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      <SaveBar dirty={dirty} loading={saving} onSave={save} onReset={reset} />
    </PageWrap>
  );
}
