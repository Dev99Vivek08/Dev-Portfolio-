"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminCard, Btn, PageWrap, PageHeader, toast, ToastProvider, EmptyState } from "@/components/admin/AdminUI";
import { uploadFile } from "@/lib/supabase";

interface MediaItem {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

const MEDIA_KEY = "devos_media_items";

function loadMedia(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(MEDIA_KEY) ?? "[]"); } catch { return []; }
}
function saveMedia(items: MediaItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1048576).toFixed(1)}MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>(() => loadMedia());
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/") || f.type === "image/svg+xml");
    if (!arr.length) { toast("Only image files are supported", "err"); return; }

    setUploading(true);
    const newItems: MediaItem[] = [];

    for (const file of arr) {
      try {
        let url: string;
        if (hasSupabase) {
          url = await uploadFile("media", `uploads/${Date.now()}-${file.name}`, file);
        } else {
          // Use local object URL for demo (note: only persists for this session)
          url = URL.createObjectURL(file);
        }
        newItems.push({ name: file.name, url, type: file.type, size: file.size, uploadedAt: new Date().toISOString() });
        toast(`Uploaded: ${file.name}`, "ok");
      } catch {
        toast(`Failed: ${file.name}`, "err");
      }
    }

    const updated = [...newItems, ...items];
    setItems(updated);
    saveMedia(updated);
    setUploading(false);
  }, [items, hasSupabase]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    toast("URL copied!", "ok");
    setTimeout(() => setCopied(null), 2000);
  };

  const remove = (url: string) => {
    const updated = items.filter(i => i.url !== url);
    setItems(updated);
    saveMedia(updated);
    toast("Removed from library", "warn");
  };

  const categories = ["all", "image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <PageWrap>
      <ToastProvider />
      <PageHeader title="Media Library" desc="Upload and manage your image assets"
        actions={
          <div className="flex items-center gap-2">
            <Btn variant="ghost" size="sm" onClick={() => setView(v => v === "grid" ? "list" : "grid")}>
              {view === "grid" ? "⊟ List" : "⊞ Grid"}
            </Btn>
            <Btn onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "↑ Upload"}
            </Btn>
            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }} />
          </div>
        } />

      {!hasSupabase && (
        <div className="mb-5 p-4 bg-[rgba(234,179,8,0.05)] border border-[rgba(234,179,8,0.15)] rounded-xl flex items-start gap-3">
          <span className="text-yellow-400 text-lg flex-shrink-0">⚠</span>
          <div>
            <div className="text-yellow-400 text-sm font-semibold">Supabase not configured</div>
            <div className="text-[#6b7280] text-xs mt-0.5">Configure <code className="font-mono text-[#D9FF00]">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono text-[#D9FF00]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to persist uploads. Currently using temporary browser URLs.</div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all mb-6 ${dragging ? "border-[#D9FF00] bg-[rgba(217,255,0,0.03)]" : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(217,255,0,0.2)] hover:bg-[rgba(217,255,0,0.01)]"}`}>
        <AnimatePresence>
          {dragging && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-[rgba(217,255,0,0.03)]">
              <div className="text-[#D9FF00] font-mono text-lg font-bold">Drop to upload</div>
            </motion.div>
          )}
        </AnimatePresence>
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#D9FF00]/30 border-t-[#D9FF00] rounded-full animate-spin" />
            <span className="text-[#D9FF00] font-mono text-sm">Uploading...</span>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">◻</div>
            <div className="text-white text-sm font-medium mb-1">Drag & drop images here</div>
            <div className="text-[#6b7280] text-xs">or click to browse — PNG, JPG, WEBP, SVG, GIF</div>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "png", "jpeg", "webp", "svg", "gif"].map(f => {
          const typeKey = f === "all" ? "all" : `image/${f === "svg" ? "svg+xml" : f}`;
          const count = f === "all" ? items.length : items.filter(i => i.type === typeKey).length;
          return (
            <button key={f} onClick={() => setFilter(typeKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${filter === typeKey ? "bg-[#D9FF00] text-black font-bold" : "border border-[rgba(255,255,255,0.06)] text-[#6b7280] hover:text-white"}`}>
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState icon="◻" title={items.length === 0 ? "No media uploaded yet" : "No matches"} desc={items.length === 0 ? "Upload images to use in your projects and sections." : undefined}
            action={items.length === 0 ? <Btn onClick={() => inputRef.current?.click()}>↑ Upload First Image</Btn> : undefined} />
        </AdminCard>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <AnimatePresence>
            {filtered.map(item => (
              <motion.div key={item.url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden hover:border-[rgba(217,255,0,0.15)] transition-all">
                <div className="aspect-square relative overflow-hidden bg-[#050505]">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => copy(item.url)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${copied === item.url ? "bg-[#D9FF00] text-black" : "bg-white/10 text-white hover:bg-[#D9FF00] hover:text-black"}`}>
                      {copied === item.url ? "✓" : "⎘"}
                    </button>
                    <button onClick={() => remove(item.url)}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-red-500 flex items-center justify-center text-sm transition-all">×</button>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-white text-[11px] truncate font-mono">{item.name}</div>
                  <div className="text-[#4b5563] text-[10px] font-mono">{formatSize(item.size)}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <AdminCard>
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.url} className="flex items-center gap-3 p-3 bg-[#050505] border border-[rgba(255,255,255,0.05)] rounded-xl hover:border-[rgba(255,255,255,0.08)] group transition-all">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0a0a0a] flex-shrink-0">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-mono truncate">{item.name}</div>
                  <div className="text-[#4b5563] text-[10px] font-mono">{formatSize(item.size)} · {item.type.split("/")[1].toUpperCase()} · {new Date(item.uploadedAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Btn size="sm" variant="ghost" onClick={() => copy(item.url)}>{copied === item.url ? "✓ Copied" : "⎘ Copy URL"}</Btn>
                  <Btn size="sm" variant="danger" onClick={() => remove(item.url)}>Delete</Btn>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </PageWrap>
  );
}
