"use client";
import { useState } from "react";
import { Reorder } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { Skill } from "@/lib/admin-types";
import { AdminCard, Field, Input, Btn, Modal, Badge, PageWrap, PageHeader, SaveBar, toast, ToastProvider, useConfirm, EmptyState, DragHandle } from "@/components/admin/AdminUI";

const CATEGORIES = ["Frontend", "Backend", "Language", "Database", "DevOps", "Cloud", "API", "3D/WebGL", "Animation", "Mobile", "Other"];
const EMOJI_PRESETS = ["⚛️","📘","🟢","🐍","🗄️","🔴","🐳","☁️","◈","🎮","✨","💨","🦀","⚡","🌊","🔧","📦","🎯","🧠","⭕"];

const blank = (): Skill => ({ id: `sk-${Date.now()}`, name: "", category: "Frontend", icon: "⚡", sortOrder: 0 });

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(() => [...loadAdminData().skills].sort((a, b) => a.sortOrder - b.sortOrder));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const { confirm, Dialog } = useConfirm();

  const mark = (fn: (s: Skill[]) => Skill[]) => { setSkills(s => { const n = fn(s); setDirty(true); return n; }); };
  const openNew = () => { setEditSkill(blank()); setIsNew(true); };
  const openEdit = (s: Skill) => { setEditSkill({ ...s }); setIsNew(false); };

  const saveEdit = () => {
    if (!editSkill) return;
    if (!editSkill.name.trim()) { toast("Skill name is required", "err"); return; }
    mark(ss => isNew ? [...ss, { ...editSkill, sortOrder: ss.length }] : ss.map(s => s.id === editSkill.id ? editSkill : s));
    setEditSkill(null);
    toast(isNew ? "Skill added!" : "Skill updated!", "ok");
  };

  const del = async (id: string) => {
    const ok = await confirm("Delete this skill?");
    if (ok) { mark(ss => ss.filter(s => s.id !== id)); toast("Skill deleted", "warn"); }
  };

  const reorder = (newOrder: Skill[]) => { setSkills(newOrder.map((s, i) => ({ ...s, sortOrder: i }))); setDirty(true); };

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    saveAdminData({ skills });
    setSaving(false);
    setDirty(false);
    toast("Skills saved!", "ok");
  };

  const categories = ["All", ...Array.from(new Set(skills.map(s => s.category)))];
  const filtered = filterCat === "All" ? skills : skills.filter(s => s.category === filterCat);

  return (
    <PageWrap>
      <ToastProvider />
      <Dialog />
      <PageHeader title="Skills" desc="Manage your tech stack and skill grid"
        actions={<><Btn variant="ghost" onClick={() => { setSkills(loadAdminData().skills); setDirty(false); }}>Reset</Btn><Btn onClick={openNew}>+ New Skill</Btn></>} />

      {/* Category filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${filterCat === c ? "bg-[#D9FF00] text-black font-bold" : "border border-[rgba(255,255,255,0.06)] text-[#6b7280] hover:text-white"}`}>
            {c} {c !== "All" && `(${skills.filter(s => s.category === c).length})`}
          </button>
        ))}
      </div>

      <AdminCard title={`Skills (${filtered.length})`} desc="Drag to reorder" action={<Btn size="sm" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>}>
        {filtered.length === 0 ? (
          <EmptyState icon="✦" title="No skills yet" desc="Add your first skill." action={<Btn onClick={openNew}>+ Add Skill</Btn>} />
        ) : (
          <Reorder.Group axis="y" values={filtered} onReorder={reorder} className="space-y-2">
            {filtered.map(s => (
              <Reorder.Item key={s.id} value={s}>
                <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-[rgba(255,255,255,0.08)] group transition-all">
                  <DragHandle />
                  <div className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-lg flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white text-sm font-medium">{s.name || "Untitled"}</span>
                    <div className="mt-0.5"><Badge>{s.category}</Badge></div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn variant="ghost" size="sm" onClick={() => openEdit(s)}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => del(s.id)}>✕</Btn>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </AdminCard>

      {/* Preview grid */}
      <AdminCard title="Preview Grid" desc="How skills appear on the portfolio" className="mt-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {skills.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl text-center hover:border-[rgba(217,255,0,0.15)] transition-colors">
              <span className="text-2xl">{s.icon}</span>
              <div className="text-white text-[11px] font-medium leading-tight">{s.name}</div>
              <div className="text-[#4b5563] text-[9px] font-mono uppercase">{s.category}</div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Edit Modal */}
      <Modal open={!!editSkill} onClose={() => setEditSkill(null)}
        title={isNew ? "New Skill" : "Edit Skill"}
        footer={<><Btn variant="ghost" onClick={() => setEditSkill(null)}>Cancel</Btn><Btn onClick={saveEdit}>{isNew ? "Add" : "Save"}</Btn></>}>
        {editSkill && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Skill Name" required>
                <Input value={editSkill.name} onChange={v => setEditSkill(s => s ? { ...s, name: v } : s)} placeholder="React / Next.js" />
              </Field>
              <Field label="Category">
                <select value={editSkill.category} onChange={e => setEditSkill(s => s ? { ...s, category: e.target.value } : s)}
                  className="w-full bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Emoji / Icon" hint="Single emoji or symbol">
              <div className="space-y-2">
                <Input value={editSkill.icon} onChange={v => setEditSkill(s => s ? { ...s, icon: v } : s)} placeholder="⚛️" />
                <div className="flex flex-wrap gap-2">
                  {EMOJI_PRESETS.map(e => (
                    <button key={e} onClick={() => setEditSkill(s => s ? { ...s, icon: e } : s)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${editSkill.icon === e ? "border-[#D9FF00] bg-[rgba(217,255,0,0.1)]" : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </Field>
            {/* Live preview */}
            <div className="flex items-center justify-center p-4 bg-[#050505] rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div className="flex flex-col items-center gap-2 p-4 border border-[rgba(217,255,0,0.15)] rounded-xl bg-[rgba(217,255,0,0.03)] w-28">
                <span className="text-3xl">{editSkill.icon}</span>
                <span className="text-white text-[11px] font-medium text-center">{editSkill.name || "Name"}</span>
                <span className="text-[#D9FF00]/60 text-[9px] font-mono">{editSkill.category}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <SaveBar dirty={dirty} loading={saving} onSave={save} />
    </PageWrap>
  );
}
