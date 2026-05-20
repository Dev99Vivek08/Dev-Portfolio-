"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface GlitchOverlayProps {
  onComplete: () => void;
}

export default function GlitchOverlay({ onComplete }: GlitchOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 z-[9980] pointer-events-none overflow-hidden"
    >
      {/* RGB split layers */}
      <motion.div
        animate={{
          x: [-4, 4, -4, 2, -2, 0],
          opacity: [0.8, 0.6, 0.9, 0.7, 0.5, 0],
        }}
        transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
        className="absolute inset-0 bg-red-500/10 mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [4, -4, 4, -2, 2, 0],
          opacity: [0.8, 0.6, 0.9, 0.7, 0.5, 0],
        }}
        transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
        className="absolute inset-0 bg-cyan-500/10 mix-blend-screen"
      />

      {/* Horizontal scan glitch lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scaleX: [0, 1, 1, 0],
            x: [Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: 0.3,
            delay: i * 0.05,
            repeat: 3,
            repeatType: "reverse",
          }}
          className="absolute left-0 right-0 bg-[#D9FF00]/20 origin-left"
          style={{
            top: `${10 + i * 10 + Math.random() * 5}%`,
            height: `${Math.random() * 3 + 1}px`,
          }}
        />
      ))}

      {/* Screen tear */}
      <motion.div
        animate={{ y: [0, window.innerHeight / 3, window.innerHeight / 2, window.innerHeight] }}
        transition={{ duration: 0.3, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-[#D9FF00] opacity-60"
      />

      {/* Flicker */}
      <motion.div
        animate={{
          opacity: [0, 0.6, 0, 0.3, 0, 0.7, 0, 0.4, 0],
        }}
        transition={{ duration: 0.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1] }}
        className="absolute inset-0 bg-[#D9FF00]/5"
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[#D9FF00] text-2xl tracking-[0.5em] uppercase rgb-split select-none"
        >
          GLITCH.DEV
        </motion.div>
      </div>
    </motion.div>
  );
}
