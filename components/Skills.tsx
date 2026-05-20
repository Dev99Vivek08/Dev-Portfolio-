"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useAdminData } from "@/lib/use-admin-data";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  const adminData = useAdminData();
  const skills = adminData.skills ?? [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);
  const availableCategories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      aria-label="Skills section"
    >
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 sm:w-[28rem] sm:h-[28rem] rounded-full blur-[140px] pointer-events-none opacity-[0.025]"
        style={{ background: "#D9FF00" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-12 sm:mb-16"
        >
          <div className="section-label">
            <span className="font-mono text-xs text-[#D9FF00] tracking-[0.28em] uppercase">03 — Skills</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3">
            Tech Arsenal
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-lg">
            Tools and technologies I use to build exceptional digital experiences.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10 sm:mb-12"
          role="group"
          aria-label="Filter skills by category"
        >
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`font-mono text-[11px] tracking-widest uppercase px-3 sm:px-4 py-2 rounded-md border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#D9FF00] text-black border-[#D9FF00] font-bold"
                  : "text-[#9CA3AF] border-white/10 hover:border-[rgba(217,255,0,0.3)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.ul
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
          role="list"
          aria-label="Skills list"
        >
          {filtered.map((skill) => (
            <motion.li
              key={skill.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.04 }}
              className="group relative glass neon-border rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3 cursor-default hover:border-[rgba(217,255,0,0.35)] transition-all duration-300 overflow-hidden"
              aria-label={`${skill.name} — ${skill.category}`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgba(217,255,0,0.05) 0%, transparent 65%)" }}
                aria-hidden="true"
              />

              <div
                className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 relative z-10"
                role="img"
                aria-hidden="true"
              >
                {skill.icon}
              </div>
              <div className="text-center relative z-10">
                <div className="text-white text-[11px] sm:text-xs font-semibold leading-tight">{skill.name}</div>
                <div className="text-[#9CA3AF] text-[9px] sm:text-[10px] font-mono mt-0.5 tracking-wide">{skill.category}</div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 sm:mt-16 flex items-center gap-4"
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-white/[0.05]" />
          <span className="font-mono text-[10px] sm:text-xs text-[#9CA3AF] tracking-widest">
            Always learning. Always building.
          </span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </motion.div>
      </div>
    </section>
  );
}
