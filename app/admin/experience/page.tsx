"use client";
import { useState } from "react";
import { Reorder, motion } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { ExperienceItem } from "@/lib/admin-types";
import { AdminCard, Field, Input, Textarea, Btn, Modal, PageWrap, PageHeader, SaveBar, toast, ToastProvider, useConfirm, EmptyState, DragHandle } from "@/components/admin/AdminUI";

const blank = (): ExperienceItem => ({ id: `exp-${Date.now()}`, year: "", role: "", company: "", description: "", sortOrder: 0 });

export default function ExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>(() => [...loadAdminData().experience].sort((a, b) => a.sortOrder - b.sortOrder));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<ExperienceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { confirm, Dialog } = useConfirm();

  const mark = (fn: (e: ExperienceItem[]) => ExperienceItem[]) => { setItems(e => { const n = fn(e); setDirty(true); return n; }); };
  const openNew = () => { setEditItem(blank()); setIsNew(true); };
  const openEdit = (item: ExperienceItem) => { setEditItem({ ...item }); setIsNew(false); };

  const saveEdit = () => {
    if (!editItem) return;
    if (!editItem.role.trim() || !editItem.company.trim()) { toast("Role and company are required", "err"); return; }
    mark(items => isNew
      ? [...items, { ...editItem, sortOrder: items.length }]
      : items.map(i => i.id === editItem.id ? editItem : i)
    );
    setEditItem(null);
    toast(isNew ? "Experience added!" : "Experience updated!", "ok");
  };

  const del = async (id: string) => {
    const ok = await confirm("Delete this experience entry?");
    if (ok) { mark(items => items.filter(i => i.id !== id)); toast("Entry deleted", "warn"); }
  };

  const reorder = (newOrder: ExperienceItem[]) => { setItems(newOrder.map((i, idx) => ({ ...i, sortOrder: idx }))); setDirty(true); };

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    saveAdminData({ experience: items });
    setSaving(false);
    setDirty(false);
    toast("Experience saved!", "ok");
  };

  return (
    <PageWrap>
      <ToastProvider />
      <Dialog />
      <PageHeader title="Experience Timeline" desc="Manage your career history"
        actions={<><Btn variant="ghost" onClick={() => { setItems(loadAdminData().experience); setDirty(false); }}>Reset</Btn><Btn onClick={openNew}>+ Add Entry</Btn></>} />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3">
          <AdminCard title={`Timeline (${items.length})`} desc="Drag to reorder" action={<Btn size="sm" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Btn>}>
            {items.length === 0 ? (
              <EmptyState icon="◆" title="No experience entries" desc="Add your career history." action={<Btn onClick={openNew}>+ Add</Btn>} />
            ) : (
              <Reorder.Group axis="y" values={items} onReorder={reorder} className="space-y-2">
                {items.map(item => (
                  <Reorder.Item key={item.id} value={item}>
                    <div className="flex items-start gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-[rgba(255,255,255,0.08)] group transition-all">
                      <div className="mt-1">
                        <DragHandle />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white text-sm font-semibold">{item.role || "Untitled Role"}</span>
                        </div>
                        <div className="text-[#D9FF00] text-xs font-mono mb-1">{item.company}</div>
                        <div className="text-[#6b7280] text-[11px] font-mono mb-1">{item.year}</div>
                        {item.description && (
                          <div className="text-[#4b5563] text-xs line-clamp-2">{item.description}</div>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Btn variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Btn>
                        <Btn variant="danger" size="sm" onClick={() => del(item.id)}>✕</Btn>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </AdminCard>
        </div>

        {/* Timeline preview */}
        <div className="lg:col-span-2">
          <AdminCard title="Preview" desc="Timeline visualization">
            <div className="relative space-y-0 pl-4">
              {/* Line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-[rgba(217,255,0,0.1)]" />
              {items.map((item, i) => (
                <motion.div key={item.id} layout className="relative pl-6 pb-5">
                  {/* Dot */}
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#D9FF00] shadow-[0_0_8px_rgba(217,255,0,0.5)]" />
                  <div className="font-mono text-[#D9FF00] text-[10px] tracking-widest mb-0.5">{item.year}</div>
                  <div className="text-white text-sm font-semibold">{item.role}</div>
                  <div className="text-[#6b7280] text-xs">{item.company}</div>
                  {item.description && (
                    <div className="text-[#4b5563] text-[11px] mt-1 leading-relaxed line-clamp-2">{item.description}</div>
                  )}
                </motion.div>
              ))}
              {items.length === 0 && (
                <div className="text-[#374151] text-sm text-center py-8">No entries yet</div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)}
        title={isNew ? "New Experience" : "Edit Experience"}
        footer={<><Btn variant="ghost" onClick={() => setEditItem(null)}>Cancel</Btn><Btn onClick={saveEdit}>{isNew ? "Add Entry" : "Save"}</Btn></>}>
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role / Title" required>
                <Input value={editItem.role} onChange={v => setEditItem(e => e ? { ...e, role: v } : e)} placeholder="Senior Engineer" />
              </Field>
              <Field label="Company" required>
                <Input value={editItem.company} onChange={v => setEditItem(e => e ? { ...e, company: v } : e)} placeholder="Company Inc." />
              </Field>
            </div>
            <Field label="Year Range" hint="e.g. 2023 — Now">
              <Input value={editItem.year} onChange={v => setEditItem(e => e ? { ...e, year: v } : e)} placeholder="2023 — Now" mono />
            </Field>
            <Field label="Description">
              <Textarea value={editItem.description} onChange={v => setEditItem(e => e ? { ...e, description: v } : e)} rows={3} placeholder="What you did here..." />
            </Field>
          </div>
        )}
      </Modal>

      <SaveBar dirty={dirty} loading={saving} onSave={save} />
    </PageWrap>
  );
}
