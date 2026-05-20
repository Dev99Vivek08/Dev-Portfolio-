"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const TITLES: Record<string, { label: string; desc: string }> = {
  "/admin": { label: "Dashboard", desc: "Overview & quick actions" },
  "/admin/hero": { label: "Hero Section", desc: "Edit the landing section" },
  "/admin/about": { label: "About Section", desc: "Edit bio, stats & links" },
  "/admin/projects": { label: "Projects", desc: "Manage project cards" },
  "/admin/skills": { label: "Skills", desc: "Manage tech stack" },
  "/admin/experience": { label: "Experience", desc: "Edit career timeline" },
  "/admin/terminal": { label: "Terminal", desc: "Manage commands & output" },
  "/admin/media": { label: "Media Manager", desc: "Upload & manage assets" },
  "/admin/messages": { label: "Messages", desc: "Contact form submissions" },
  "/admin/settings": { label: "Settings", desc: "Theme, SEO & performance" },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const info = TITLES[pathname] ?? { label: "Admin", desc: "" };
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.04)] px-6 py-3 flex items-center justify-between gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-[#4b5563]">
          <Link href="/admin" className="hover:text-[#D9FF00] transition-colors">Admin</Link>
          {pathname !== "/admin" && (
            <>
              <span>/</span>
              <span className="text-[#9ca3af]">{info.label}</span>
            </>
          )}
        </div>
        <div className="lg:hidden">
          <div className="text-white font-semibold text-sm">{info.label}</div>
        </div>
        {info.desc && <div className="hidden xl:block text-[#4b5563] text-[11px] font-mono">— {info.desc}</div>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] animate-pulse" />
          <span className="font-mono text-[10px] text-[#6b7280]">LIVE</span>
        </div>

        {/* Time */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-[#4b5563]">
          <span>{dateStr}</span>
          <span className="text-[#D9FF00]/40">|</span>
          <span>{timeStr}</span>
        </div>

        {/* View site */}
        <Link href="/" target="_blank"
          className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#6b7280] hover:text-[#D9FF00] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(217,255,0,0.2)] px-3 py-1.5 rounded-lg transition-all">
          <span>↗</span> Live Site
        </Link>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-[rgba(217,255,0,0.08)] border border-[rgba(217,255,0,0.15)] flex items-center justify-center font-mono text-[#D9FF00] text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}
