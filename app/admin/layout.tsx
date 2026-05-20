"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-store";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); setAuthed(true); return; }
    const ok = isAdminAuthed();
    if (!ok) { router.replace("/admin/login"); } else { setAuthed(true); }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="font-mono text-[#D9FF00] text-sm tracking-widest animate-pulse">LOADING SYSTEM...</div>
    </div>
  );

  if (pathname === "/admin/login") return <>{children}</>;
  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
