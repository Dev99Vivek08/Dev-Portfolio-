"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { HeroData } from "@/lib/admin-types";
import { AdminCard, Field, Input, Textarea, Toggle, Btn, PageWrap, PageHeader, SaveBar, toast, ToastProvider } from "@/components/admin/AdminUI";

export default function HeroPage() {
  const [hero, setHero] = useState<HeroData>(() => loadAdminData().hero);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRole, setNewRole] = useState("");

  const update = <K extends keyof HeroData>(key: K, value: HeroData[K]) => {
    setHero(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    saveAdminData({ hero });
    setSaving(false);
    setDirty(false);
    toast("Hero section saved!", "ok");
  };

  const reset = () => {
    setHero(loadAdminData().hero);
    setDirty(false);
  };

  const addRole = () => {
    const v = newRole.trim();
    if (v) { update("roles", [...hero.roles, v]); setNewRole(""); }
  };

  return (
    <PageWrap>
      <PageHeader title="Hero Section" desc="Edit the main landing section of your portfolio"
        actions={<><Btn variant="ghost" onClick={reset}>Reset</Btn><Btn onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Btn></>} />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Identity */}
        <AdminCard title="Identity" desc="Your name and tagline">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" required>
                <Input value={hero.firstName} onChange={v => update("firstName", v)} placeholder="Alex" />
              </Field>
              <Field label="Last Name" required>
                <Input value={hero.lastName} onChange={v => update("lastName", v)} placeholder="Chen" />
              </Field>
            </div>
            <Field label="Subtitle" hint="Shown below name">
              <Textarea value={hero.subtitle} onChange={v => update("subtitle", v)} rows={3} placeholder="Crafting digital experiences..." />
            </Field>
            <Field label="Avatar Emoji" hint="Shown in hero card">
              <Input value={hero.avatarEmoji} onChange={v => update("avatarEmoji", v)} placeholder="👨‍💻" />
            </Field>
          </div>
        </AdminCard>

        {/* Status + CTA */}
        <AdminCard title="Status & Actions" desc="Availability badge and buttons">
          <div className="space-y-4">
            <Field label="Status Badge Text">
              <Input value={hero.statusText} onChange={v => update("statusText", v)} placeholder="Available for work" />
            </Field>
            <Toggle checked={hero.statusActive} onChange={v => update("statusActive", v)}
              label="Status Active" desc="Show the green dot indicator" />
            <div className="h-px bg-[rgba(255,255,255,0.04)] my-2" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Primary Label">
                <Input value={hero.ctaPrimary} onChange={v => update("ctaPrimary", v)} placeholder="View Projects" />
              </Field>
              <Field label="CTA Primary Link">
                <Input value={hero.ctaPrimaryLink} onChange={v => update("ctaPrimaryLink", v)} placeholder="#projects" mono />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA Secondary Label">
                <Input value={hero.ctaSecondary} onChange={v => update("ctaSecondary", v)} placeholder="Open Terminal" />
              </Field>
              <Field label="CTA Secondary Link">
                <Input value={hero.ctaSecondaryLink} onChange={v => update("ctaSecondaryLink", v)} placeholder="#terminal-section" mono />
              </Field>
            </div>
          </div>
        </AdminCard>

        {/* Roles Typewriter */}
        <AdminCard title="Typewriter Roles" desc="Roles that cycle in the hero animation">
          <div className="space-y-3">
            <div className="space-y-2">
              {hero.roles.map((role, i) => (
                <motion.div key={i} layout className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[rgba(217,255,0,0.08)] flex items-center justify-center text-[#D9FF00] font-mono text-[10px] flex-shrink-0">{i + 1}</div>
                  <input value={role} onChange={e => {
                    const roles = [...hero.roles]; roles[i] = e.target.value; update("roles", roles); }}
                    className="flex-1 bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] transition-all" />
                  <button onClick={() => update("roles", hero.roles.filter((_, j) => j !== i))}
                    className="text-[#374151] hover:text-red-400 transition-colors text-lg leading-none flex-shrink-0">×</button>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newRole} onChange={e => setNewRole(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addRole(); }}
                placeholder="Add new role..."
                className="flex-1 bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] transition-all placeholder-[#374151]" />
              <Btn onClick={addRole} size="sm">+ Add</Btn>
            </div>
          </div>
        </AdminCard>

        {/* Floating stat cards */}
        <AdminCard title="Floating Stat Cards" desc="The two floating info cards in the hero">
          <div className="space-y-4">
            <div className="p-3 border border-[rgba(255,255,255,0.06)] rounded-lg space-y-3">
              <div className="font-mono text-[10px] text-[#D9FF00] tracking-widest uppercase">Card 1</div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Value">
                  <Input value={hero.floatCard1Val} onChange={v => update("floatCard1Val", v)} placeholder="5+ Years" />
                </Field>
                <Field label="Label">
                  <Input value={hero.floatCard1Sub} onChange={v => update("floatCard1Sub", v)} placeholder="Experience" />
                </Field>
              </div>
            </div>
            <div className="p-3 border border-[rgba(255,255,255,0.06)] rounded-lg space-y-3">
              <div className="font-mono text-[10px] text-[#D9FF00] tracking-widest uppercase">Card 2</div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Value">
                  <Input value={hero.floatCard2Val} onChange={v => update("floatCard2Val", v)} placeholder="80+ Projects" />
                </Field>
                <Field label="Label">
                  <Input value={hero.floatCard2Sub} onChange={v => update("floatCard2Sub", v)} placeholder="Shipped" />
                </Field>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Live preview */}
      <div className="mt-6">
        <AdminCard title="Live Preview" desc="How your hero looks right now">
          <div className="rounded-lg bg-[#050505] border border-[rgba(255,255,255,0.05)] p-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(217,255,0,0.2)] bg-[rgba(217,255,0,0.05)] mb-4">
              {hero.statusActive && <span className="w-2 h-2 rounded-full bg-[#D9FF00] animate-pulse" />}
              <span className="text-[#D9FF00] text-xs font-mono">{hero.statusText}</span>
            </div>
            <div className="text-4xl mb-3">{hero.avatarEmoji}</div>
            <h1 className="text-3xl font-black text-white mb-2">{hero.firstName} <span className="text-[#D9FF00]">{hero.lastName}</span></h1>
            <div className="text-[#9ca3af] text-sm mb-4 max-w-sm mx-auto">{hero.subtitle}</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              {hero.roles.slice(0, 2).map((r, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-[rgba(217,255,0,0.08)] text-[#D9FF00] text-xs font-mono">{r}</span>
              ))}
              {hero.roles.length > 2 && <span className="text-[#4b5563] text-xs font-mono">+{hero.roles.length - 2} more</span>}
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="px-4 py-2 bg-[#D9FF00] text-black text-xs font-bold rounded-lg">{hero.ctaPrimary}</span>
              <span className="px-4 py-2 border border-[rgba(255,255,255,0.1)] text-white text-xs rounded-lg">{hero.ctaSecondary}</span>
            </div>
          </div>
        </AdminCard>
      </div>

      <SaveBar dirty={dirty} loading={saving} onSave={save} onReset={reset} />
    </PageWrap>
  );
}
