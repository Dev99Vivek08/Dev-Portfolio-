"use client";
import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { Project } from "@/lib/admin-types";
import { AdminCard, Field, Input, Textarea, Toggle, Btn, Modal, Badge, TagsInput, PageWrap, PageHeader, SaveBar, toast, ToastProvider, useConfirm, EmptyState, DragHandle } from "@/components/admin/AdminUI";

const CATEGORIES = ["AI", "Security", "Creative", "Backend", "Frontend", "Mobile", "DevOps", "Other"];

const blank = (): Project => ({
  id: `proj-${Date.now()}`, title: "", description: "", tags: [],
  image: "", github: "", live: "", category: "Other", featured: false, sortOrder: 0,
});

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() => [...loadAdminData().projects].sort((a, b) => a.sortOrder - b.sortOrder));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { confirm, Dialog } = useConfirm();

  const mark = (fn: (p: Project[]) => Project[]) => { setProjects(p => { const n = fn(p); setDirty(true); return n; }); };

  const openNew = () => { setEditProject(blank()); setIsNew(true); };
  const openEdit = (p: Project) => { setEditProject({ ...p }); setIsNew(false); };

  const saveEdit = () => {
    if (!editProject) return;
    if (!editProject.title.trim()) { toast("Title is required", "err"); return; }
    mark(ps => isNew
      ? [...ps, { ...editProject, sortOrder: ps.length }]
      : ps.map(p => p.id === editProject.id ? editProject : p)
    );
    setEditProject(null);
    toast(isNew ? "Project added!" : "Project updated!", "ok");
  };

  const del = async (id: string) => {
    const ok = await confirm("Delete this project? This cannot be undone.");
    if (ok) { mark(ps => ps.filter(p => p.id !== id)); toast("Project deleted", "warn"); }
  };

  const reorder = (newOrder: Project[]) => {
    setProjects(newOrder.map((p, i) => ({ ...p, sortOrder: i })));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    saveAdminData({ projects });
    setSaving(false);
    setDirty(false);
    toast("Projects saved!", "ok");
  };

  return (
    <PageWrap>
      <ToastProvider />
      <Dialog />
      <PageHeader title="Projects" desc="Manage your portfolio project cards"
        actions={<><Btn variant="ghost" onClick={() => { setProjects(loadAdminData().projects); setDirty(false); }}>Reset</Btn><Btn onClick={openNew}>+ New Project</Btn></>} />

      <AdminCard title={`Projects (${projects.length})`} desc="Drag to reorder" action={<Btn size="sm" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Order"}</Btn>}>
        {projects.length === 0 ? (
          <EmptyState icon="◈" title="No projects yet" desc="Add your first project to get started." action={<Btn onClick={openNew}>+ Add Project</Btn>} />
        ) : (
          <Reorder.Group axis="y" values={projects} onReorder={reorder} className="space-y-2">
            {projects.map(p => (
              <Reorder.Item key={p.id} value={p}>
                <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-[rgba(255,255,255,0.08)] transition-all group">
                  <DragHandle />
                  <div className="w-9 h-9 rounded-lg bg-[rgba(217,255,0,0.06)] border border-[rgba(217,255,0,0.1)] flex items-center justify-center text-[#D9FF00] font-mono text-xs flex-shrink-0">
                    {(p.sortOrder ?? 0) + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium truncate">{p.title || "Untitled"}</span>
                      {p.featured && <Badge variant="lime">Featured</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{p.category}</Badge>
                      {p.tags.slice(0, 3).map(t => <span key={t} className="text-[#4b5563] text-[10px] font-mono">{t}</span>)}
                      {p.tags.length > 3 && <span className="text-[#374151] text-[10px] font-mono">+{p.tags.length - 3}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Btn variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => del(p.id)}>Delete</Btn>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </AdminCard>

      {/* Edit Modal */}
      <Modal open={!!editProject} onClose={() => setEditProject(null)}
        title={isNew ? "New Project" : "Edit Project"}
        width="max-w-2xl"
        footer={<><Btn variant="ghost" onClick={() => setEditProject(null)}>Cancel</Btn><Btn onClick={saveEdit}>{isNew ? "Add Project" : "Save Changes"}</Btn></>}>
        {editProject && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Title" required>
                <Input value={editProject.title} onChange={v => setEditProject(p => p ? { ...p, title: v } : p)} placeholder="Project Name" />
              </Field>
              <Field label="Category">
                <select value={editProject.category} onChange={e => setEditProject(p => p ? { ...p, category: e.target.value } : p)}
                  className="w-full bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={editProject.description} onChange={v => setEditProject(p => p ? { ...p, description: v } : p)} rows={3} placeholder="What does this project do?" />
            </Field>
            <Field label="Tags">
              <TagsInput tags={editProject.tags} onChange={tags => setEditProject(p => p ? { ...p, tags } : p)} placeholder="Add technology..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <Input value={editProject.github ?? ""} onChange={v => setEditProject(p => p ? { ...p, github: v } : p)} placeholder="https://github.com/..." mono />
              </Field>
              <Field label="Live Demo URL">
                <Input value={editProject.live ?? ""} onChange={v => setEditProject(p => p ? { ...p, live: v } : p)} placeholder="https://..." mono />
              </Field>
            </div>
            <Field label="Image URL" hint="Direct image URL or /path/to/image">
              <Input value={editProject.image ?? ""} onChange={v => setEditProject(p => p ? { ...p, image: v } : p)} placeholder="https://... or /images/project.jpg" mono />
            </Field>
            <Toggle checked={editProject.featured} onChange={v => setEditProject(p => p ? { ...p, featured: v } : p)}
              label="Featured Project" desc="Show prominently at the top of the projects grid" />
          </div>
        )}
      </Modal>

      <SaveBar dirty={dirty} loading={saving} onSave={save} />
    </PageWrap>
  );
}
