import { motion } from "framer-motion";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  inView?: boolean;
}

export default function SectionHeader({
  index,
  label,
  title,
  subtitle,
  inView = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className="mb-12 sm:mb-16"
    >
      <div className="section-label">
        <span className="font-mono text-xs text-[#D9FF00] tracking-[0.28em] uppercase">
          {index} — {label}
        </span>
      </div>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 leading-none">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#9CA3AF] text-sm sm:text-base max-w-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
