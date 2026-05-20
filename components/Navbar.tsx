"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToSection } from "@/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const navLinks = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills" },
  { label: "Terminal", href: "#terminal" },
  { label: "Contact",  href: "#contact" },
];

const sectionIds = navLinks.map((l) => l.href.slice(1));

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false);
    scrollToSection(href, 0);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 navbar-safe ${
          scrolled
            ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-[#D9FF00] font-bold tracking-widest text-sm hover:opacity-70 transition-opacity focus-visible:ring-1 focus-visible:ring-[#D9FF00] focus-visible:outline-none"
            style={{ minHeight: "unset", minWidth: "unset" }}
            aria-label="Scroll to top"
          >
            DEV.OS<span className="blink ml-0.5">_</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7" role="list">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  role="listitem"
                  aria-current={isActive ? "location" : undefined}
                  className={`text-sm tracking-wide transition-colors duration-200 relative group ${
                    isActive ? "text-white" : "text-[#9CA3AF] hover:text-white"
                  }`}
                  style={{ minHeight: "unset", minWidth: "unset" }}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#D9FF00] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className="btn-outline text-xs py-1.5 px-4"
              style={{ minHeight: "unset" }}
              aria-label="Download resume PDF"
            >
              Resume ↗
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded flex flex-col gap-1.5 focus-visible:ring-1 focus-visible:ring-[#D9FF00] focus-visible:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <span className={`block w-5 h-px bg-[#D9FF00] transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-px bg-[#D9FF00] transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-px bg-[#D9FF00] transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] md:hidden"
            style={{ top: "64px", paddingBottom: "var(--safe-bottom)" }}
          >
            <div
              className="absolute inset-0 bg-[#050505]/98 backdrop-blur-2xl"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="relative flex flex-col h-full px-6 pt-10 pb-20 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center gap-3 py-4 text-2xl font-bold text-[#9CA3AF] hover:text-white transition-colors text-left border-b border-white/[0.04]"
                  style={{ minHeight: "unset", minWidth: "unset", display: "flex" }}
                >
                  <span className="font-mono text-xs text-[#D9FF00] opacity-60 w-6">0{i + 1}</span>
                  {link.label}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                href="/resume.pdf"
                download
                className="mt-8 btn-outline self-start"
                style={{ minHeight: "44px", minWidth: "unset" }}
              >
                Download Resume ↗
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
