"use client";
import { useState } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { TerminalCommand, TerminalOutputLine, TOutputType, TAction, TerminalSettings } from "@/lib/admin-types";
import { AdminCard, Field, Input, Textarea, Toggle, Btn, Modal, Badge, Select, PageWrap, PageHeader, SaveBar, toast, ToastProvider, useConfirm, EmptyState, DragHandle, Divider } from "@/components/admin/AdminUI";

const ACTIONS: { value: TAction; label: string }[] = [
  { value: "none", label: "None" },
  { value: "openSection", label: "Scroll to section" },
  { value: "openURL", label: "Open URL" },
  { value: "triggerGlitch", label: "Trigger glitch effect" },
  { value: "triggerMatrix", label: "Trigger matrix rain" },
  { value: "openAdmin", label: "Open admin panel" },
  { value: "clearTerminal", label: "Clear terminal" },
  { value: "toggleMusic", label: "Toggle music" },
];

const OUTPUT_TYPES: { value: TOutputType; label: string; color: string }[] = [
  { value: "sys", label: "System", color: "text-[#4b5563]" },
  { value: "ok", label: "Success", color: "text-[#D9FF00]" },
  { value: "warn", label: "Warning", color: "text-yellow-400" },
  { value: "err", label: "Error", color: "text-red-400" },
  { value: "out", label: "Output", color: "text-[#9ca3af]" },
];

const blank = (): TerminalCommand => ({
  id: `cmd-${Date.now()}`, trigger: "", description: "", hidden: false,
  output: [{ type: "ok", text: "" }], action: "none", actionValue: "", sortOrder: 0,
});

export default function TerminalPage() {
  const initial = loadAdminData();
  const [commands, setCommands] = useState<TerminalCommand[]>(() => [...initial.terminalCommands].sort((a, b) => a.sortOrder - b.sortOrder));
  const [settings, setSettings] = useState<TerminalSettings>(() => initial.terminal);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editCmd, setEditCmd] = useState<TerminalCommand | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<"commands" | "settings">("commands");
  const { confirm, Dialog } = useConfirm();

  const mark = (fn: (c: TerminalCommand[]) => TerminalCommand[]) => { setCommands(c => { const n = fn(c); setDirty(true); return n; }); };
  const openNew = () => { setEditCmd(blank()); setIsNew(true); };
  const openEdit = (c: TerminalCommand) => { setEditCmd({ ...c, output: [...c.output.map(o => ({ ...o }))] }); setIsNew(false); };

  const saveEdit = () => {
    if (!editCmd) return;
    if (!editCmd.trigger.trim()) { toast("Trigger keyword is required", "err"); return; }
    mark(cs => isNew ? [...cs, { ...editCmd, sortOrder: cs.length }] : cs.map(c => c.id === editCmd.id ? editCmd : c));
    setEditCmd(null);
    toast(isNew ? "Command added!" : "Command updated!", "ok");
  };

  const del = async (id: string) => {
    const ok = await confirm("Delete this terminal command?");
    if (ok) { mark(cs => cs.filter(c => c.id !== id)); toast("Command deleted", "warn"); }
  };

  const addOutputLine = () => setEditCmd(c => c ? { ...c, output: [...c.output, { type: "out", text: "" }] } : c);
  const removeOutputLine = (i: number) => setEditCmd(c => c ? { ...c, output: c.output.filter((_, j) => j !== i) } : c);
  const updateOutputLine = (i: number, field: keyof TerminalOutputLine, value: string) =>
    setEditCmd(c => c ? { ...c, output: c.output.map((o, j) => j === i ? { ...o, [field]: value } : o) } : c);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    saveAdminData({ terminalCommands: commands, terminal: settings });
    setSaving(false);
    setDirty(false);
    toast("Terminal configuration saved!", "ok");
  };

  const typeColor: Record<TOutputType, string> = { sys: "text-[#4b5563]", ok: "text-[#D9FF00]", warn: "text-yellow-400", err: "text-red-400", out: "text-[#9ca3af]" };

  return (
    <PageWrap>
      <ToastProvider />
      <Dialog />
      <PageHeader title="Terminal Control" desc="Manage commands, output and terminal behavior"
        actions={<><Btn variant="ghost" onClick={() => { const d = loadAdminData(); setCommands(d.terminalCommands); setSettings(d.terminal); setDirty(false); }}>Reset</Btn><Btn onClick={save} disabled={saving}>{saving ? "Saving..." : "Save All"}</Btn></>} />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-[#0a0a0a] rounded-xl border border-[rgba(255,255,255,0.04)] w-fit">
        {(["commands", "settings"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${activeTab === t ? "bg-[#D9FF00] text-black font-bold" : "text-[#6b7280] hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "commands" && (
        <>
          <AdminCard title={`Commands (${commands.length})`} desc="Drag to reorder • hidden commands won't show in 'help'"
            action={<Btn size="sm" onClick={openNew}>+ New Command</Btn>}>
            {commands.length === 0 ? (
              <EmptyState icon="▶" title="No commands yet" action={<Btn onClick={openNew}>+ Add Command</Btn>} />
            ) : (
              <Reorder.Group axis="y" values={commands} onReorder={cmds => { setCommands(cmds.map((c, i) => ({ ...c, sortOrder: i }))); setDirty(true); }} className="space-y-2">
                {commands.map(cmd => (
                  <Reorder.Item key={cmd.id} value={cmd}>
                    <div className="flex items-center gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-[rgba(255,255,255,0.08)] group transition-all">
                      <DragHandle />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-[#D9FF00] font-mono text-sm bg-[rgba(217,255,0,0.06)] px-2 py-0.5 rounded">{cmd.trigger}</code>
                          {cmd.hidden && <Badge variant="yellow">hidden</Badge>}
                          {cmd.action !== "none" && <Badge variant="blue">{cmd.action}</Badge>}
                        </div>
                        {cmd.description && <div className="text-[#6b7280] text-xs mt-1">{cmd.description}</div>}
                      </div>
                      <div className="text-[#374151] text-[11px] font-mono flex-shrink-0">{cmd.output.length} lines</div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Btn variant="ghost" size="sm" onClick={() => openEdit(cmd)}>Edit</Btn>
                        <Btn variant="danger" size="sm" onClick={() => del(cmd.id)}>✕</Btn>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </AdminCard>

          {/* Terminal preview */}
          <AdminCard title="Terminal Preview" desc="Live simulation of command output" className="mt-6">
            <div className="bg-[#020202] border border-[rgba(217,255,0,0.06)] rounded-xl p-4 font-mono text-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1.5">{["#ef4444","#eab308","#22c55e"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />)}</div>
                <span className="text-[#374151] text-xs ml-2">{settings.startupText}</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {commands.slice(0, 3).map(cmd => (
                  <div key={cmd.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-[#D9FF00]/60 text-xs">{settings.prompt}</span>
                      <span className="text-white text-xs">{cmd.trigger}</span>
                    </div>
                    {cmd.output.slice(0, 2).map((line, i) => (
                      <div key={i} className={`text-xs pl-4 ${typeColor[line.type]}`}>{line.text}</div>
                    ))}
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[#D9FF00]/60 text-xs">{settings.prompt}</span>
                  <span className="text-[#D9FF00] text-xs animate-pulse">█</span>
                </div>
              </div>
            </div>
          </AdminCard>
        </>
      )}

      {activeTab === "settings" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <AdminCard title="Terminal Behavior" desc="Configure how the terminal works">
            <div className="space-y-4">
              <Toggle checked={settings.enabled} onChange={v => { setSettings(s => ({ ...s, enabled: v })); setDirty(true); }}
                label="Terminal Enabled" desc="Show terminal section on portfolio" />
              <Divider />
              <Field label="Startup Text">
                <Input value={settings.startupText} onChange={v => { setSettings(s => ({ ...s, startupText: v })); setDirty(true); }}
                  placeholder="DEV.OS TERMINAL v2.0" mono />
              </Field>
              <Field label="Prompt Symbol">
                <Input value={settings.prompt} onChange={v => { setSettings(s => ({ ...s, prompt: v })); setDirty(true); }}
                  placeholder="[dev@os ~]$" mono />
              </Field>
              <Field label="Typing Speed (ms/char)" hint="Lower = faster">
                <input type="range" min={20} max={200} value={settings.typingSpeed}
                  onChange={e => { setSettings(s => ({ ...s, typingSpeed: Number(e.target.value) })); setDirty(true); }}
                  className="w-full accent-[#D9FF00]" />
                <div className="text-[#D9FF00] font-mono text-xs mt-1">{settings.typingSpeed}ms/char</div>
              </Field>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Command Edit Modal */}
      <Modal open={!!editCmd} onClose={() => setEditCmd(null)}
        title={isNew ? "New Command" : `Edit: ${editCmd?.trigger}`}
        width="max-w-2xl"
        footer={<><Btn variant="ghost" onClick={() => setEditCmd(null)}>Cancel</Btn><Btn onClick={saveEdit}>{isNew ? "Add" : "Save"}</Btn></>}>
        {editCmd && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Trigger Keyword" required hint="What user types">
                <Input value={editCmd.trigger} onChange={v => setEditCmd(c => c ? { ...c, trigger: v } : c)} placeholder="help" mono />
              </Field>
              <Field label="Description" hint="Shown in help menu">
                <Input value={editCmd.description} onChange={v => setEditCmd(c => c ? { ...c, description: v } : c)} placeholder="Show all commands" />
              </Field>
            </div>
            <Toggle checked={editCmd.hidden} onChange={v => setEditCmd(c => c ? { ...c, hidden: v } : c)}
              label="Hidden Command" desc="Won't appear in the 'help' command output" />
            <Divider />
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[10px] text-[#9ca3af] tracking-widest uppercase">Output Lines</label>
                <Btn size="sm" variant="ghost" onClick={addOutputLine}>+ Line</Btn>
              </div>
              <div className="space-y-2">
                {editCmd.output.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select value={line.type} onChange={e => updateOutputLine(i, "type", e.target.value)}
                      className="bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-2 py-2 text-white text-xs outline-none focus:border-[rgba(217,255,0,0.3)] transition-all flex-shrink-0 w-24">
                      {OUTPUT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input value={line.text} onChange={e => updateOutputLine(i, "text", e.target.value)}
                      placeholder="Output text..."
                      className={`flex-1 bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-[rgba(217,255,0,0.3)] transition-all ${typeColor[line.type]}`} />
                    <button onClick={() => removeOutputLine(i)} className="text-[#374151] hover:text-red-400 transition-colors text-lg flex-shrink-0">×</button>
                  </div>
                ))}
              </div>
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Action">
                <Select value={editCmd.action} onChange={v => setEditCmd(c => c ? { ...c, action: v as TAction } : c)} options={ACTIONS} />
              </Field>
              {(editCmd.action === "openSection" || editCmd.action === "openURL") && (
                <Field label={editCmd.action === "openURL" ? "URL" : "Section ID"}>
                  <Input value={editCmd.actionValue ?? ""} onChange={v => setEditCmd(c => c ? { ...c, actionValue: v } : c)}
                    placeholder={editCmd.action === "openURL" ? "https://..." : "#projects"} mono />
                </Field>
              )}
            </div>
          </div>
        )}
      </Modal>

      <SaveBar dirty={dirty} loading={saving} onSave={save} />
    </PageWrap>
  );
}
