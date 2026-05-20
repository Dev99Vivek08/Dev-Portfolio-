"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Toast ─────────────────────────────────────────────────────────────────────
export type ToastType = "ok" | "err" | "warn" | "info";
interface ToastItem { id: number; type: ToastType; msg: string; }

let toastCb: ((t: ToastItem) => void) | null = null;
export function toast(msg: string, type: ToastType = "ok") {
  toastCb?.({ id: Date.now(), type, msg });
}

export function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    toastCb = (t) => {
      setItems(p => [...p, t]);
      setTimeout(() => setItems(p => p.filter(x => x.id !== t.id)), 3500);
    };
    return () => { toastCb = null; };
  }, []);
  const colors = { ok: "border-[#D9FF00] text-[#D9FF00]", err: "border-red-500 text-red-400", warn: "border-yellow-500 text-yellow-400", info: "border-blue-500 text-blue-400" };
  const icons = { ok: "✓", err: "✗", warn: "⚠", info: "ℹ" };
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {items.map(t => (
          <motion.div key={t.id} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
            className={`bg-[#0a0a0a] border ${colors[t.type]} rounded-lg px-4 py-3 flex items-center gap-2.5 shadow-2xl min-w-[220px]`}>
            <span className="text-sm">{icons[t.type]}</span>
            <span className="text-white text-sm font-medium">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps { title?: string; desc?: string; children: React.ReactNode; className?: string; action?: React.ReactNode; }
export function AdminCard({ title, desc, children, className = "", action }: CardProps) {
  return (
    <div className={`bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between gap-4">
          <div>
            {title && <div className="text-white font-semibold text-sm">{title}</div>}
            {desc && <div className="text-[#6b7280] text-[11px] mt-0.5 font-mono">{desc}</div>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
interface FieldProps { label: string; hint?: string; required?: boolean; children: React.ReactNode; }
export function Field({ label, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[10px] text-[#9ca3af] tracking-widest uppercase">
          {label}{required && <span className="text-[#D9FF00] ml-1">*</span>}
        </label>
        {hint && <span className="text-[#4b5563] text-[10px] font-mono">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean; disabled?: boolean; }
export function Input({ value, onChange, placeholder, type = "text", mono, disabled }: InputProps) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled}
      className={`w-full bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] focus:ring-1 focus:ring-[rgba(217,255,0,0.1)] transition-all placeholder-[#374151] disabled:opacity-40 disabled:cursor-not-allowed ${mono ? "font-mono" : ""}`} />
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; mono?: boolean; }
export function Textarea({ value, onChange, placeholder, rows = 4, mono }: TextareaProps) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      placeholder={placeholder}
      className={`w-full bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] focus:ring-1 focus:ring-[rgba(217,255,0,0.1)] transition-all placeholder-[#374151] resize-y ${mono ? "font-mono text-xs" : ""}`} />
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }
export function Select({ value, onChange, options }: SelectProps) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] transition-all appearance-none cursor-pointer">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; label?: string; desc?: string; }
export function Toggle({ checked, onChange, label, desc }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        {label && <div className="text-white text-sm font-medium">{label}</div>}
        {desc && <div className="text-[#6b7280] text-[11px] mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!checked)} type="button"
        className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${checked ? "bg-[#D9FF00]" : "bg-[rgba(255,255,255,0.08)]"}`}>
        <motion.div animate={{ x: checked ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`absolute top-1 w-4 h-4 rounded-full transition-colors ${checked ? "bg-black" : "bg-[#6b7280]"}`} />
      </button>
    </div>
  );
}

// ── Btn ───────────────────────────────────────────────────────────────────────
interface BtnProps { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger" | "outline"; size?: "sm" | "md"; type?: "button" | "submit"; disabled?: boolean; className?: string; }
export function Btn({ children, onClick, variant = "primary", size = "md", type = "button", disabled, className = "" }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-[#D9FF00] text-black hover:shadow-[0_0_20px_rgba(217,255,0,0.25)] active:scale-[0.98]",
    ghost: "text-[#6b7280] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]",
    danger: "text-red-400 hover:text-red-300 hover:bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.1)]",
    outline: "border border-[rgba(217,255,0,0.2)] text-[#D9FF00] hover:bg-[rgba(217,255,0,0.04)]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "lime" | "red" | "yellow" | "blue" }) {
  const v = { default: "bg-[rgba(255,255,255,0.05)] text-[#9ca3af]", lime: "bg-[rgba(217,255,0,0.1)] text-[#D9FF00]", red: "bg-[rgba(239,68,68,0.08)] text-red-400", yellow: "bg-[rgba(234,179,8,0.08)] text-yellow-400", blue: "bg-[rgba(59,130,246,0.08)] text-blue-400" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono ${v[variant]}`}>{children}</span>;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, color = "lime" }: { label: string; value: string | number; sub?: string; icon: string; color?: "lime" | "blue" | "red" | "yellow" }) {
  const colors = { lime: "text-[#D9FF00] bg-[rgba(217,255,0,0.06)] border-[rgba(217,255,0,0.1)]", blue: "text-blue-400 bg-[rgba(59,130,246,0.06)] border-[rgba(59,130,246,0.1)]", red: "text-red-400 bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.1)]", yellow: "text-yellow-400 bg-[rgba(234,179,8,0.06)] border-[rgba(234,179,8,0.1)]" };
  return (
    <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base ${colors[color]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-[#6b7280] text-xs mt-0.5">{label}</div>
      {sub && <div className="text-[#4b5563] text-[10px] font-mono mt-1">{sub}</div>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; width?: string; }
export function Modal({ open, onClose, title, children, footer, width = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className={`relative w-full ${width} bg-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl overflow-hidden z-10`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
              <h3 className="text-white font-semibold text-sm">{title}</h3>
              <button onClick={onClose} className="text-[#6b7280] hover:text-white transition-colors text-lg leading-none">×</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Color Picker ──────────────────────────────────────────────────────────────
export function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-[rgba(255,255,255,0.08)] cursor-pointer bg-transparent p-0.5" />
      </div>
      <div className="flex-1">
        {label && <div className="font-mono text-[10px] text-[#9ca3af] tracking-wider uppercase mb-1">{label}</div>}
        <Input value={value} onChange={onChange} placeholder="#D9FF00" mono />
      </div>
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────────────────────────
export function Slider({ value, onChange, min = 0, max = 100, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[10px] text-[#9ca3af] tracking-widest uppercase">{label}</label>
          <span className="font-mono text-xs text-[#D9FF00]">{value}</span>
        </div>
      )}
      <div className="relative h-2 bg-[rgba(255,255,255,0.05)] rounded-full">
        <div className="absolute left-0 top-0 h-full rounded-full bg-[#D9FF00]/50" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#D9FF00] rounded-full shadow-[0_0_8px_rgba(217,255,0,0.5)] pointer-events-none"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }} />
      </div>
    </div>
  );
}

// ── Tags Input ────────────────────────────────────────────────────────────────
export function TagsInput({ tags, onChange, placeholder = "Add tag..." }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) { onChange([...tags, v]); }
    setInput("");
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 bg-[#050505] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[rgba(217,255,0,0.3)] transition-all placeholder-[#374151]" />
        <Btn onClick={add} size="sm">Add</Btn>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} className="inline-flex items-center gap-1.5 bg-[rgba(217,255,0,0.08)] border border-[rgba(217,255,0,0.15)] text-[#D9FF00] rounded-md px-2.5 py-1 text-[11px] font-mono">
              {t}
              <button onClick={() => onChange(tags.filter(x => x !== t))} className="text-[#D9FF00]/50 hover:text-[#D9FF00] leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page Wrapper ──────────────────────────────────────────────────────────────
export function PageWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {children}
      <ToastProvider />
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {desc && <p className="text-[#6b7280] text-sm mt-1">{desc}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// ── Save Bar ──────────────────────────────────────────────────────────────────
export function SaveBar({ dirty, loading, onSave, onReset }: { dirty: boolean; loading: boolean; onSave: () => void; onReset?: () => void }) {
  return (
    <AnimatePresence>
      {dirty && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0f0f0f] border border-[rgba(217,255,0,0.2)] rounded-xl px-4 py-3 shadow-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] animate-pulse" />
          <span className="text-sm text-[#9ca3af]">Unsaved changes</span>
          {onReset && <Btn variant="ghost" size="sm" onClick={onReset} disabled={loading}>Discard</Btn>}
          <Btn size="sm" onClick={onSave} disabled={loading}>
            {loading ? <><span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />Saving...</> : "Save Changes"}
          </Btn>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: { icon: string; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16 px-8">
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-white font-semibold mb-2">{title}</div>
      {desc && <div className="text-[#6b7280] text-sm mb-6">{desc}</div>}
      {action}
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
export function useConfirm() {
  const [state, setState] = useState<{ open: boolean; msg: string; resolve?: (v: boolean) => void }>({ open: false, msg: "" });
  const confirm = (msg: string) => new Promise<boolean>(res => setState({ open: true, msg, resolve: res }));
  const close = (val: boolean) => { state.resolve?.(val); setState({ open: false, msg: "" }); };
  const Dialog = () => (
    <Modal open={state.open} onClose={() => close(false)} title="Confirm"
      footer={<><Btn variant="ghost" onClick={() => close(false)}>Cancel</Btn><Btn variant="danger" onClick={() => close(true)}>Delete</Btn></>}>
      <p className="text-[#9ca3af] text-sm">{state.msg}</p>
    </Modal>
  );
  return { confirm, Dialog };
}

// ── Drag handle ───────────────────────────────────────────────────────────────
export function DragHandle() {
  return <div className="cursor-grab active:cursor-grabbing text-[#4b5563] hover:text-[#D9FF00] transition-colors px-1 select-none">⠿</div>;
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider() {
  return <div className="border-t border-[rgba(255,255,255,0.04)] my-4" />;
}

// ── Inline list row ───────────────────────────────────────────────────────────
export function ListRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[#050505] hover:border-[rgba(255,255,255,0.07)] transition-colors ${className}`}>
      {children}
    </div>
  );
}
