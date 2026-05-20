"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadAdminData, saveAdminData } from "@/lib/admin-store";
import type { ContactMessage } from "@/lib/admin-types";
import { AdminCard, Btn, Badge, Modal, PageWrap, PageHeader, toast, ToastProvider, useConfirm, EmptyState } from "@/components/admin/AdminUI";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const { confirm, Dialog } = useConfirm();

  useEffect(() => {
    setMessages(loadAdminData().messages);
    const handler = (e: Event) => setMessages((e as CustomEvent).detail?.messages ?? []);
    window.addEventListener("admin-updated", handler);
    return () => window.removeEventListener("admin-updated", handler);
  }, []);

  const save = (msgs: ContactMessage[]) => {
    setMessages(msgs);
    saveAdminData({ messages: msgs });
  };

  const markRead = (id: string) => save(messages.map(m => m.id === id ? { ...m, read: true } : m));
  const toggleStar = (id: string) => save(messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  const markAllRead = () => save(messages.map(m => ({ ...m, read: true })));

  const del = async (id: string) => {
    const ok = await confirm("Permanently delete this message?");
    if (ok) {
      const updated = messages.filter(m => m.id !== id);
      save(updated);
      if (selected?.id === id) setSelected(null);
      toast("Message deleted", "warn");
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id);
  };

  const exportCSV = () => {
    const rows = [["Name", "Email", "Message", "Date", "Read"].join(","),
      ...messages.map(m => [m.name, m.email, `"${m.message.replace(/"/g,"'")}"`, new Date(m.createdAt).toLocaleDateString(), m.read ? "Yes" : "No"].join(","))
    ].join("\n");
    const a = document.createElement("a"); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(rows)}`; a.download = "messages.csv"; a.click();
    toast("Messages exported!", "ok");
  };

  const filtered = messages.filter(m => {
    if (filter === "unread") return !m.read;
    if (filter === "starred") return m.starred;
    return true;
  });

  const unread = messages.filter(m => !m.read).length;

  return (
    <PageWrap>
      <ToastProvider />
      <Dialog />
      <PageHeader title="Messages" desc="Contact form submissions from your portfolio"
        actions={
          <div className="flex items-center gap-2">
            {unread > 0 && <Btn variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Btn>}
            <Btn variant="ghost" size="sm" onClick={exportCSV}>↓ Export CSV</Btn>
          </div>
        } />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: messages.length, color: "text-white" },
          { label: "Unread", value: unread, color: "text-[#D9FF00]" },
          { label: "Starred", value: messages.filter(m => m.starred).length, color: "text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[#6b7280] text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(["all", "unread", "starred"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${filter === f ? "bg-[#D9FF00] text-black font-bold" : "border border-[rgba(255,255,255,0.06)] text-[#6b7280] hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState icon="◎"
            title={filter === "all" ? "No messages yet" : `No ${filter} messages`}
            desc={filter === "all" ? "Messages submitted through your contact form will appear here." : undefined} />
        </AdminCard>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                onClick={() => openMessage(msg)}
                className={`flex items-start gap-4 p-4 bg-[#0a0a0a] border rounded-xl cursor-pointer transition-all hover:border-[rgba(255,255,255,0.1)] ${!msg.read ? "border-[rgba(217,255,0,0.12)]" : "border-[rgba(255,255,255,0.05)]"}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${!msg.read ? "bg-[rgba(217,255,0,0.1)] text-[#D9FF00]" : "bg-[rgba(255,255,255,0.04)] text-[#6b7280]"}`}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold ${!msg.read ? "text-white" : "text-[#9ca3af]"}`}>{msg.name}</span>
                    {!msg.read && <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]" />}
                    {msg.starred && <span className="text-yellow-400 text-xs">★</span>}
                    <span className="text-[#374151] text-[10px] font-mono ml-auto flex-shrink-0">{timeAgo(msg.createdAt)}</span>
                  </div>
                  <div className="text-[#6b7280] text-[11px] font-mono mb-1">{msg.email}</div>
                  <div className="text-[#6b7280] text-xs truncate">{msg.message}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleStar(msg.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${msg.starred ? "text-yellow-400" : "text-[#374151] hover:text-yellow-400"}`}>★</button>
                  <button onClick={() => del(msg.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#374151] hover:text-red-400 transition-colors text-sm">×</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)}
        title="Message Detail"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Btn variant="ghost" size="sm" onClick={() => { if (selected) toggleStar(selected.id); setSelected(p => p ? { ...p, starred: !p.starred } : p); }}>
                {selected?.starred ? "★ Unstar" : "☆ Star"}
              </Btn>
              <Btn variant="danger" size="sm" onClick={() => { if (selected) del(selected.id); }}>Delete</Btn>
            </div>
            <a href={`mailto:${selected?.email}?subject=Re: Your message&body=Hi ${selected?.name},%0A%0A`}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D9FF00] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_16px_rgba(217,255,0,0.25)] transition-all">
              Reply via Email ↗
            </a>
          </div>
        }>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-[10px] text-[#6b7280] tracking-widest uppercase mb-1">From</div>
                <div className="text-white font-semibold">{selected.name}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#6b7280] tracking-widest uppercase mb-1">Email</div>
                <div className="text-[#D9FF00] font-mono text-sm">{selected.email}</div>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#6b7280] tracking-widest uppercase mb-1">Received</div>
              <div className="text-[#9ca3af] text-sm font-mono">{new Date(selected.createdAt).toLocaleString()}</div>
            </div>
            <div className="h-px bg-[rgba(255,255,255,0.05)]" />
            <div>
              <div className="font-mono text-[10px] text-[#6b7280] tracking-widest uppercase mb-2">Message</div>
              <div className="bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 text-[#9ca3af] text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageWrap>
  );
}
