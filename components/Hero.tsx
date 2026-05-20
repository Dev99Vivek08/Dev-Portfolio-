"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useAdminData } from "@/lib/use-admin-data";

const ParticleField = dynamic(() => import("./ParticleField"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid-bg opacity-30" />,
});

export default function Hero({ onTerminalClick }: { onTerminalClick: () => void }) {
  const adminData = useAdminData();
  const { hero, contact } = adminData;
  const roles = hero.roles?.length ? hero.roles : ["Full Stack Developer", "UI/UX Engineer", "3D Creative Dev"];
  const socialLinks = [
    { label: "GitHub", href: contact.github || "https://github.com" },
    { label: "LinkedIn", href: contact.linkedin || "https://linkedin.com" },
    { label: "Twitter", href: contact.twitter || "https://twitter.com" },
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayRole, setDisplayRole] = useState("");
  const [typing, setTyping] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const role = roles[roleIndex];
    let i = 0;
    setDisplayRole("");
    setTyping(true);

    const typeInterval = setInterval(() => {
      if (i < role.length) {
        setDisplayRole(role.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setTyping(false);
          setTimeout(() => {
            setRoleIndex((prev) => (prev + 1) % roles.length);
          }, 500);
        }, 2000);
      }
    }, prefersReduced ? 0 : 60);

    return () => clearInterval(typeInterval);
  }, [roleIndex, prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const handleMouse = (e: MouseEvent) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      avatarRef.current.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [prefersReduced]);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nameParts = [hero.firstName || "Alex", hero.lastName || "Chen"];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      <ParticleField />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.7) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, transparent, #050505)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[80vh]">

          {/* Left — Text */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-2.5 mb-7"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9FF00] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9FF00]" />
              </span>
              <span className="font-mono text-xs text-[#9CA3AF] tracking-[0.22em] uppercase">
                {hero.statusText || "Available for work"}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="leading-none tracking-tight mb-4"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {nameParts.map((word, i) => (
                <span
                  key={i}
                  className={`block text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black ${
                    i === 1 ? "text-[#D9FF00]" : "text-white"
                  }`}
                >
                  {word}
                </span>
              ))}
            </motion.h1>

            {/* Role typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-mono text-base sm:text-lg text-[#9CA3AF] mb-2 h-7 flex items-center gap-2"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-[#D9FF00] opacity-50">›</span>
              <span>{displayRole}</span>
              <span className={`text-[#D9FF00] ${typing ? "blink" : "opacity-0"}`} aria-hidden="true">_</span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed mb-9 max-w-md"
            >
              {hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <button
                onClick={() => scrollToSection("#projects")}
                className="btn-primary"
                aria-label="View my projects"
              >
                View Projects
              </button>
              <button
                onClick={onTerminalClick}
                className="btn-outline"
                aria-label="Open developer terminal"
              >
                Open Terminal
              </button>
            </motion.div>

            {/* Social links */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-6 mt-9"
              aria-label="Social links"
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9CA3AF] hover:text-[#D9FF00] text-xs tracking-widest uppercase transition-colors duration-200 font-mono"
                  aria-label={`Visit ${s.label} profile`}
                >
                  {s.label}
                </a>
              ))}
            </motion.nav>
          </div>

          {/* Right — Avatar */}
          <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              aria-hidden="true"
            >
              {/* Rotating rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[rgba(217,255,0,0.06)] animate-[spin_25s_linear_infinite]" />
                <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[rgba(217,255,0,0.1)] animate-[spin_18s_linear_infinite_reverse]" />
              </div>

              {/* Avatar container */}
              <div
                ref={avatarRef}
                className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
                style={{ transformStyle: "preserve-3d", perspective: "800px", transition: "transform 0.08s ease-out" }}
              >
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                    background: "linear-gradient(145deg, #111 0%, #1a1a1a 100%)",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#080808] to-[#161616]">
                    <div className="text-center">
                      <div className="text-5xl sm:text-6xl mb-2">👨‍💻</div>
                      <div className="font-mono text-[10px] text-[#D9FF00] opacity-50 tracking-widest">AVATAR.PNG</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[rgba(217,255,0,0.02)] to-transparent" />
                </div>

                {/* Hex glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-60"
                  style={{
                    clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                    background: "transparent",
                    boxShadow: "inset 0 0 0 1.5px rgba(217,255,0,0.25), 0 0 50px rgba(217,255,0,0.12)",
                  }}
                />
              </div>

              {/* Floating stat cards — hidden on small mobile */}
              <motion.div
                animate={prefersReduced ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 sm:-left-10 top-1/4 glass neon-border rounded-lg px-3 py-2 hidden sm:block"
              >
                <div className="font-mono text-xs text-[#D9FF00] font-bold">5+ Years</div>
                <div className="font-mono text-[10px] text-[#9CA3AF]">Experience</div>
              </motion.div>

              <motion.div
                animate={prefersReduced ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-4 sm:-right-6 bottom-1/4 glass neon-border rounded-lg px-3 py-2 hidden sm:block"
              >
                <div className="font-mono text-xs text-[#D9FF00] font-bold">80+ Projects</div>
                <div className="font-mono text-[10px] text-[#9CA3AF]">Shipped</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] text-[#9CA3AF] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-[#D9FF00] to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
