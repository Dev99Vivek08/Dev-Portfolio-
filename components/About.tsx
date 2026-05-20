"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAdminData } from "@/lib/use-admin-data";

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay, type: "spring", stiffness: 150 }}
        className="text-3xl sm:text-4xl font-black text-[#D9FF00] mb-1"
        aria-label={`${value} ${label}`}
      >
        {value}
      </motion.div>
      <div className="text-[#9CA3AF] text-[10px] sm:text-xs font-mono tracking-widest uppercase">{label}</div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  const adminData = useAdminData();
  const about = {
    ...adminData.about,
    experience: adminData.experience,
    email: adminData.contact.email,
    location: adminData.contact.location,
  };
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      aria-label="About section"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full blur-[120px] pointer-events-none opacity-[0.025]"
        style={{ background: "#D9FF00" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16 sm:mb-20"
        >
          <div className="section-label">
            <span className="font-mono text-xs text-[#D9FF00] tracking-[0.28em] uppercase">01 — About</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">
            Who I Am
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Bio + stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <motion.p
              variants={itemVariants}
              className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed mb-10"
            >
              {about.bio}
            </motion.p>

            {/* Stats grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-0 glass neon-border rounded-xl overflow-hidden mb-8"
            >
              {about.stats.map((stat, i) => (
                <AnimatedStat key={stat.label} value={stat.value} label={stat.label} delay={0.1 + i * 0.08} />
              ))}
            </motion.div>

            {/* Meta info */}
            <motion.dl variants={containerVariants} className="space-y-3">
              {[
                { label: "Location", value: about.location },
                { label: "Email", value: about.email },
                { label: "Status", value: about.availabilityStatus },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  className="flex items-center gap-4"
                >
                  <dt className="font-mono text-[10px] sm:text-xs text-[#D9FF00] tracking-widest w-16 sm:w-20 uppercase shrink-0">
                    {item.label}
                  </dt>
                  <div className="h-px flex-1 bg-white/5" aria-hidden="true" />
                  <dd className="text-[#9CA3AF] text-xs sm:text-sm">{item.value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Right: Timeline */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-mono text-[10px] sm:text-xs text-[#D9FF00] tracking-[0.28em] uppercase mb-8"
            >
              Experience Timeline
            </motion.h3>

            <div className="relative pl-5 sm:pl-7 border-l border-white/8">
              {about.experience.map((exp, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  className="relative mb-8 last:mb-0"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[26px] sm:-left-[30px] top-5 w-3 h-3 rounded-full border border-[#D9FF00] bg-[#050505] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]" />
                  </div>

                  <div className="glass neon-border rounded-xl p-5 sm:p-6 group hover:border-[rgba(217,255,0,0.25)] transition-all duration-300">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div>
                        <div className="text-white font-bold text-sm sm:text-base">{exp.role}</div>
                        <div className="text-[#D9FF00] text-xs sm:text-sm font-mono mt-0.5">{exp.company}</div>
                      </div>
                      <div className="font-mono text-[10px] sm:text-xs text-[#9CA3AF] border border-white/8 px-2 py-1 rounded tracking-wide shrink-0">
                        {exp.year}
                      </div>
                    </div>
                    <p className="text-[#9CA3AF] text-xs sm:text-sm leading-relaxed">{exp.description}</p>
                    <div className="h-px mt-4 bg-gradient-to-r from-[#D9FF00] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" aria-hidden="true" />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
