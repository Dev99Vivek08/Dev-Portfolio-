"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { loadAdminData, type AdminData } from "@/lib/admin-store";
import { StatCard, ToastProvider } from "@/components/admin/AdminUI";

const QUICK_ACTIONS = [
  { href: "/admin/hero", label: "Edit Hero", desc: "Name, roles, subtitle", icon: "⚡", color: "lime" },
  { href: "/admin/projects", label: "Add Project", desc: "Create new project card", icon: "◈", color: "blue" },
  { href: "/admin/terminal", label: "Terminal Commands", desc: "Manage CLI commands", icon: "▶", color: "yellow" },
  { href: "/admin/settings", label: "Theme & SEO", desc: "Colors, fonts, metadata", icon: "◍", color: "lime" },
  { href: "/admin/messages", label: "View Messages", desc: "Contact submissions", icon: "◎", color: "red" },
  { href: "/admin/media", label: "Media Library", desc: "Upload & manage assets", icon: "◻", color: "blue" },
];

const RECENT_PAGES = [
  { href: "/admin/hero", label: "Hero Section" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/about", label: "About" },
];

function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm bg-[rgba(217,255,0,0.12)] hover:bg-[rgba(217,255,0,0.25)] transition-colors relative overflow-hidden"
            style={{ height: `${Math.max((v / max) * 52, 4)}px` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#D9FF00]/20 to-transparent" />
          </div>
          <span className="text-[8px] text-[#374151] font-mono">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [visitData] = useState(() => Array.from({ length: 7 }, () => Math.floor(Math.random() * 80 + 20)));
  const [msgData] = useState(() => Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)));

  useEffect(() => { setData(loadAdminData()); }, []);

  if (!data) return null;

  const unread = data.messages.filter(m => !m.read).length;
  const totalMsgs = data.messages.length;
  const totalProjects = data.projects.length;
  const totalSkills = data.skills.length;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <ToastProvider />

      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="font-mono text-[#D9FF00] text-[11px] tracking-widest uppercase mb-1">Welcome back</div>
        <h1 className="text-2xl font-bold text-white">Control Panel</h1>
        <p className="text-[#6b7280] text-sm mt-1">Manage your portfolio content from one place.</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Projects" value={totalProjects} icon="◈" color="lime" sub={`${data.projects.filter(p => p.featured).length} featured`} />
        <StatCard label="Skills" value={totalSkills} icon="✦" color="blue" sub={`${[...new Set(data.skills.map(s => s.category))].length} categories`} />
        <StatCard label="Messages" value={totalMsgs} icon="◎" color={unread > 0 ? "red" : "blue"} sub={unread > 0 ? `${unread} unread` : "All read"} />
        <StatCard label="Commands" value={data.terminalCommands.length} icon="▶" color="yellow" sub={`${data.terminalCommands.filter(c => c.hidden).length} hidden`} />
      </motion.div>

      {/* Charts + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Charts */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
          <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white font-semibold text-sm">Portfolio Views</div>
                <div className="text-[#6b7280] text-[11px] mt-0.5 font-mono">Last 7 days — simulated</div>
              </div>
              <div className="text-right">
                <div className="text-[#D9FF00] font-mono font-bold text-lg">{visitData.reduce((a, b) => a + b, 0)}</div>
                <div className="text-[#4b5563] text-[10px] font-mono">total views</div>
              </div>
            </div>
            <MiniBarChart data={visitData} />
          </div>
          <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white font-semibold text-sm">Contact Messages</div>
                <div className="text-[#6b7280] text-[11px] mt-0.5 font-mono">Submissions per day</div>
              </div>
              <div className="text-right">
                <div className="text-[#D9FF00] font-mono font-bold text-lg">{totalMsgs}</div>
                <div className="text-[#4b5563] text-[10px] font-mono">total received</div>
              </div>
            </div>
            <MiniBarChart data={msgData} />
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl p-5 h-full">
            <div className="text-white font-semibold text-sm mb-4">Quick Access</div>
            <div className="space-y-1">
              {RECENT_PAGES.map(p => (
                <Link key={p.href} href={p.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.03)] border border-transparent hover:border-[rgba(255,255,255,0.04)] transition-all group">
                  <span className="text-[#9ca3af] text-sm group-hover:text-white transition-colors">{p.label}</span>
                  <span className="text-[#4b5563] group-hover:text-[#D9FF00] text-xs transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section editors grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="text-white font-semibold text-sm mb-4">All Sections</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((a) => {
            const borderColor = a.color === "lime" ? "hover:border-[rgba(217,255,0,0.2)]" : a.color === "blue" ? "hover:border-[rgba(59,130,246,0.2)]" : a.color === "red" ? "hover:border-[rgba(239,68,68,0.2)]" : "hover:border-[rgba(234,179,8,0.2)]";
            const iconColor = a.color === "lime" ? "text-[#D9FF00]" : a.color === "blue" ? "text-blue-400" : a.color === "red" ? "text-red-400" : "text-yellow-400";
            return (
              <Link key={a.href} href={a.href}
                className={`group flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] ${borderColor} rounded-xl transition-all hover:bg-[#0d0d0d]`}>
                <div className={`w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-base ${iconColor} group-hover:scale-110 transition-transform`}>
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium">{a.label}</div>
                  <div className="text-[#6b7280] text-[11px] mt-0.5 truncate">{a.desc}</div>
                </div>
                <div className="ml-auto text-[#4b5563] group-hover:text-[#D9FF00] transition-colors text-sm flex-shrink-0">→</div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Portfolio preview link */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-8 p-4 rounded-xl border border-[rgba(217,255,0,0.08)] bg-[rgba(217,255,0,0.02)] flex items-center justify-between gap-4">
        <div>
          <div className="text-white text-sm font-medium">Live Portfolio Preview</div>
          <div className="text-[#6b7280] text-xs mt-0.5">Changes you make here update instantly via localStorage.</div>
        </div>
        <Link href="/" target="_blank"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#D9FF00] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(217,255,0,0.25)] transition-all">
          ↗ Preview
        </Link>
      </motion.div>
    </div>
  );
}
