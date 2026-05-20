"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setAdminAuth } from "@/lib/admin-store";

const NAV = [
  {
    group: "OVERVIEW",
    items: [
      { href: "/admin", label: "Dashboard", icon: "⊞" },
    ],
  },
  {
    group: "CONTENT",
    items: [
      { href: "/admin/hero", label: "Hero", icon: "⚡" },
      { href: "/admin/about", label: "About", icon: "◉" },
      { href: "/admin/projects", label: "Projects", icon: "◈" },
      { href: "/admin/skills", label: "Skills", icon: "✦" },
      { href: "/admin/experience", label: "Experience", icon: "◆" },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { href: "/admin/terminal", label: "Terminal", icon: "▶" },
      { href: "/admin/media", label: "Media", icon: "◻" },
    ],
  },
  {
    group: "COMMUNICATION",
    items: [
      { href: "/admin/messages", label: "Messages", icon: "◎" },
    ],
  },
  {
    group: "CONFIG",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "◍" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setAdminAuth(false);
    router.replace("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.04)]">
        <Link href="/" className="block">
          <div className="font-mono text-[#D9FF00] font-bold tracking-widest text-sm">DEV.OS<span className="animate-pulse">_</span></div>
          <div className="font-mono text-[#6b7280] text-[9px] tracking-[0.25em] uppercase mt-0.5">Admin Panel</div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5 scrollbar-none">
        {NAV.map(group => (
          <div key={group.group}>
            <div className="font-mono text-[9px] text-[#374151] tracking-[0.3em] uppercase px-3 mb-1.5">{group.group}</div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative ${active ? "bg-[rgba(217,255,0,0.08)] text-white" : "text-[#6b7280] hover:text-white hover:bg-[rgba(255,255,255,0.03)]"}`}>
                    {active && (
                      <motion.div layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D9FF00] rounded-r-full" />
                    )}
                    <span className={`text-base font-mono w-5 text-center transition-colors ${active ? "text-[#D9FF00]" : "text-[#4b5563] group-hover:text-[#D9FF00]"}`}>{item.icon}</span>
                    <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.04)] space-y-1">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#6b7280] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all">
          <span className="font-mono text-base w-5 text-center">↗</span>
          <span className="text-[13px]">View Portfolio</span>
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#6b7280] hover:text-red-400 hover:bg-[rgba(239,68,68,0.04)] transition-all">
          <span className="font-mono text-base w-5 text-center">⏻</span>
          <span className="text-[13px]">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-[#080808] border-r border-[rgba(255,255,255,0.04)] flex-col z-50">
        <SidebarContent />
      </div>

      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg flex items-center justify-center text-[#D9FF00]">
        ☰
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#080808] border-r border-[rgba(255,255,255,0.06)] z-50">
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
