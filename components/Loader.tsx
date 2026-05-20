"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLogs = [
  "Initializing system kernel...",
  "Connecting to secure server...",
  "Loading neural core modules...",
  "Mounting asset pipeline...",
  "Decrypting portfolio data...",
  "Calibrating renderer...",
  "Welcome back, DEV.",
];

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let logIndex = 0;

    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setCurrentLogs((prev) => [...prev, bootLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 320);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setDone(true);
            setTimeout(() => {
              setVisible(false);
              onComplete();
            }, 700);
          }, 300);
          return 100;
        }
        return Math.min(prev + Math.random() * 5 + 1.5, 100);
      });
    }, 70);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const pct = Math.min(Math.round(progress), 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center"
          role="status"
          aria-label="Loading portfolio"
          aria-live="polite"
        >
          {/* Subtle scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
            }}
            aria-hidden="true"
          />

          {/* Corner brackets */}
          {[
            "top-5 left-5 border-l border-t",
            "top-5 right-5 border-r border-t",
            "bottom-5 left-5 border-l border-b",
            "bottom-5 right-5 border-r border-b",
          ].map((cls) => (
            <div
              key={cls}
              className={`absolute ${cls} border-[rgba(217,255,0,0.18)] w-7 h-7`}
              aria-hidden="true"
            />
          ))}

          <div className="w-full max-w-sm sm:max-w-md px-6 font-mono">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-8 text-center"
            >
              <div className="text-[#D9FF00] text-2xl sm:text-3xl font-bold tracking-widest mb-1">
                DEV.OS
              </div>
              <div className="text-[#9CA3AF] text-[10px] tracking-[0.3em] uppercase">
                v2.0.26 // Neural Interface Active
              </div>
            </motion.div>

            {/* Log terminal */}
            <div
              className="border border-[rgba(217,255,0,0.12)] rounded-lg p-4 mb-5 h-44 overflow-hidden relative"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-[rgba(217,255,0,0.2)]" aria-hidden="true" />

              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.04]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] opacity-70" aria-hidden="true" />
                <span className="text-[#9CA3AF] text-[10px] tracking-widest">BOOT SEQUENCE</span>
              </div>

              <div className="space-y-1">
                {currentLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-[11px] flex items-start gap-2 ${
                      log === "Welcome back, DEV."
                        ? "text-[#D9FF00]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    <span className="text-[#D9FF00] opacity-50 shrink-0" aria-hidden="true">›</span>
                    <span>{log}</span>
                    {i === currentLogs.length - 1 && !done && (
                      <span className="blink text-[#D9FF00]" aria-hidden="true">_</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#9CA3AF] text-[10px] tracking-widest">INITIALIZING</span>
                <span className="text-[#D9FF00] text-[10px] font-bold tracking-widest">
                  {pct}%
                </span>
              </div>
              <div className="h-0.5 bg-white/5 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#D9FF00] rounded-full"
                  style={{ width: `${progress}%` }}
                  animate={{
                    boxShadow: [
                      "0 0 6px rgba(217,255,0,0.5)",
                      "0 0 16px rgba(217,255,0,0.8)",
                      "0 0 6px rgba(217,255,0,0.5)",
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>

            {done && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-5"
              >
                <span className="text-[#D9FF00] text-xs tracking-[0.35em] uppercase">
                  System Ready
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
