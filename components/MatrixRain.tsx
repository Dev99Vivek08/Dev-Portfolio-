"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MatrixRainProps {
  onExit: () => void;
}

export default function MatrixRain({ onExit }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(0);

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01アβΔΣΩ∞∇∂∫ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";

    let raf: number;

    const draw = () => {
      ctx.fillStyle = "rgba(5,5,5,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading character brighter
        if (drops[i] * fontSize < canvas.height) {
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.fillText(char, x, y);
        }

        // Rest of the trail
        ctx.fillStyle = i % 3 === 0 ? "#D9FF00" : "rgba(217,255,0,0.5)";
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Auto exit after 10 seconds
    const exitTimer = setTimeout(onExit, 10000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      clearTimeout(exitTimer);
    };
  }, [onExit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9990] bg-black"
      onClick={onExit}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="font-mono text-[#D9FF00] text-xs tracking-[0.5em] uppercase mb-4 opacity-70">
            Matrix Mode Active
          </div>
          <div className="font-mono text-white/30 text-xs tracking-widest">
            Click anywhere to exit
          </div>
        </motion.div>
      </div>

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 border-l-2 border-t-2 border-[#D9FF00] w-8 h-8 opacity-60" />
      <div className="absolute top-4 right-4 border-r-2 border-t-2 border-[#D9FF00] w-8 h-8 opacity-60" />
      <div className="absolute bottom-4 left-4 border-l-2 border-b-2 border-[#D9FF00] w-8 h-8 opacity-60" />
      <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-[#D9FF00] w-8 h-8 opacity-60" />
    </motion.div>
  );
}
