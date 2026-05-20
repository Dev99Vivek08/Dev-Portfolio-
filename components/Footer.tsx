"use client";
import { motion } from "framer-motion";
import { useAdminData } from "@/lib/use-admin-data";
import { scrollToSection } from "@/utils";

const footerLinks = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills" },
  { label: "Terminal", href: "#terminal" },
  { label: "Contact",  href: "#contact" },
];

export default function Footer() {
  const adminData  = useAdminData();
  const { contact } = adminData;

  const socialLinks = [
    { label: "GitHub",   href: contact.github   || "https://github.com" },
    { label: "LinkedIn", href: contact.linkedin  || "https://linkedin.com" },
    { label: "Twitter",  href: contact.twitter   || "https://twitter.com" },
  ];

  const year = new Date().getFullYear();
  const footerText = contact.footerText || "Building immersive digital experiences with precision and passion.";

  return (
    <footer
      className="relative border-t border-white/[0.05] pt-14 footer-safe"
      role="contentinfo"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(217,255,0,0.15), transparent)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-mono text-[#D9FF00] font-bold tracking-widest text-sm hover:opacity-70 transition-opacity mb-2"
              style={{ minHeight: "unset", minWidth: "unset", display: "block" }}
              aria-label="Back to top"
            >
              DEV.OS<span className="blink ml-0.5">_</span>
            </button>
            <p className="text-[#9CA3AF] text-xs max-w-xs leading-relaxed">{footerText}</p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-[#9CA3AF] hover:text-[#D9FF00] text-xs tracking-wide transition-colors duration-200"
                  style={{ minHeight: "unset", minWidth: "unset" }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Social */}
          <nav aria-label="Social links">
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-link text-[#9CA3AF] hover:text-[#D9FF00] text-xs font-mono tracking-widest uppercase transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="h-px bg-white/[0.04] mb-8" aria-hidden="true" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#9CA3AF] tracking-wide">
            © {year} <span className="text-[#D9FF00]">Alex Chen</span>. All rights reserved.
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#9CA3AF]">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9FF00] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D9FF00]" />
            </span>
            Built with Next.js · Framer Motion · Three.js
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-xs text-[#9CA3AF] hover:text-[#D9FF00] tracking-widest uppercase transition-colors duration-200 flex items-center gap-2"
            style={{ minHeight: "unset", minWidth: "unset" }}
            aria-label="Scroll back to top"
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
