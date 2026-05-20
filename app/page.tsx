"use client";
import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import Loader    from "@/components/Loader";
import Navbar    from "@/components/Navbar";
import Hero      from "@/components/Hero";
import About     from "@/components/About";
import Projects  from "@/components/Projects";
import Skills    from "@/components/Skills";
import Contact   from "@/components/Contact";
import Footer    from "@/components/Footer";
import GlitchOverlay from "@/components/GlitchOverlay";

const Terminal   = dynamic(() => import("@/components/Terminal"),   { ssr: false });
const MatrixRain = dynamic(() => import("@/components/MatrixRain"), { ssr: false });
const AdminPanel = dynamic(() => import("@/components/AdminPanel"), { ssr: false });
const Cursor     = dynamic(() => import("@/components/Cursor"),     { ssr: false });

export default function Home() {
  const [loaderDone,  setLoaderDone]  = useState(false);
  const [showMatrix,  setShowMatrix]  = useState(false);
  const [showGlitch,  setShowGlitch]  = useState(false);
  const [showAdmin,   setShowAdmin]   = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);
  const handleMatrixMode     = useCallback(() => setShowMatrix(true),  []);
  const handleGlitch         = useCallback(() => setShowGlitch(true),  []);
  const handleAdminTrigger   = useCallback(() => setShowAdmin(true),   []);

  const handleTerminalClick = useCallback(() => {
    const el = document.querySelector("#terminal");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Cursor />

      <Loader onComplete={handleLoaderComplete} />

      <AnimatePresence>
        {showMatrix && <MatrixRain onExit={() => setShowMatrix(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showGlitch && <GlitchOverlay onComplete={() => setShowGlitch(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>

      {loaderDone && (
        <>
          <Navbar />

          <Hero onTerminalClick={handleTerminalClick} />

          <About />

          <Projects />

          <Skills />

          <div ref={terminalRef}>
            <Terminal
              onMatrixMode={handleMatrixMode}
              onGlitch={handleGlitch}
              onAdminTrigger={handleAdminTrigger}
              autoFocus={false}
            />
          </div>

          <Contact />

          <Footer />
        </>
      )}
    </main>
  );
}
