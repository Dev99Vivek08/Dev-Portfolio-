"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useAdminData } from "@/lib/use-admin-data";

const categories = ["All", "AI", "Security", "Creative", "Backend"];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Projects() {
  const adminData = useAdminData();
  const projects = adminData.projects ?? [];
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      aria-label="Projects section"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-[0.02]"
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
            <span className="font-mono text-xs text-[#D9FF00] tracking-[0.28em] uppercase">02 — Projects</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3">
            Selected Work
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-lg">
            A curated selection of projects that showcase my technical range and design sensibility.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10 sm:mb-12"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`font-mono text-[11px] tracking-widest uppercase px-3 sm:px-4 py-2 rounded-md border transition-all duration-200 ${
                activeFilter === cat
                  ? "bg-[#D9FF00] text-black border-[#D9FF00] font-bold"
                  : "text-[#9CA3AF] border-white/10 hover:border-[rgba(217,255,0,0.3)] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
          >
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                variants={cardVariants}
                className="group relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a] hover:border-[rgba(217,255,0,0.18)] transition-all duration-400"
                style={{ transition: "border-color 0.35s ease, box-shadow 0.35s ease" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(217,255,0,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Image / Visual area */}
                <div className="relative h-44 sm:h-52 overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#161616]">
                  {/* Abstract project visual */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-[5rem] sm:text-[6rem] font-black leading-none select-none opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
                      style={{ color: "#D9FF00", fontFamily: "var(--font-inter)" }}
                      aria-hidden="true"
                    >
                      {project.title.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Grid lines subtle */}
                  <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{ background: "linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)" }}
                    aria-hidden="true"
                  />

                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: "linear-gradient(to right, transparent, #D9FF00, transparent)" }}
                    aria-hidden="true"
                  />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="font-mono text-[10px] sm:text-xs text-[#D9FF00] border border-[rgba(217,255,0,0.25)] bg-black/70 backdrop-blur-sm px-2 py-1 rounded tracking-widest">
                      {project.category}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <span className="font-mono text-[10px] sm:text-xs text-black bg-[#D9FF00] px-2 py-1 rounded tracking-widest font-bold">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#D9FF00] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-[#9CA3AF] text-xs sm:text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5" aria-label="Technologies used">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-[#9CA3AF] border border-white/8 bg-white/[0.025] px-2 py-0.5 rounded tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-5 pt-1">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#D9FF00] text-[11px] font-mono tracking-widest uppercase transition-colors duration-200"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#D9FF00] text-[11px] font-mono tracking-widest uppercase transition-colors duration-200"
                      aria-label={`View ${project.title} live demo`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Live Demo
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10 sm:mt-14"
        >
          <a
            href={adminData.contact.github || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#9CA3AF] hover:text-[#D9FF00] tracking-widest uppercase transition-colors duration-200 border border-white/10 hover:border-[rgba(217,255,0,0.3)] px-6 py-3 rounded-md"
          >
            View All on GitHub
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
