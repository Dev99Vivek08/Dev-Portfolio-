"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { loadAdminData } from "@/lib/admin-store";
import type { TerminalCommand } from "@/lib/admin-types";

interface TerminalProps {
  onMatrixMode: () => void;
  onGlitch: () => void;
  onAdminTrigger: () => void;
  autoFocus?: boolean;
}

type OutputLine = {
  type: "input" | "output" | "error" | "success" | "warning" | "system";
  content: string;
};

const COMMANDS: Record<string, (args: string[]) => OutputLine[]> = {
  help: () => [
    { type: "system", content: "══════════════════════════════════════" },
    { type: "success", content: "  DEV.OS Terminal — Command Reference" },
    { type: "system", content: "══════════════════════════════════════" },
    { type: "output", content: "  help          — Show this help menu" },
    { type: "output", content: "  about         — About the developer" },
    { type: "output", content: "  projects      — List all projects" },
    { type: "output", content: "  skills        — Display tech stack" },
    { type: "output", content: "  contact       — Contact information" },
    { type: "output", content: "  clear         — Clear terminal output" },
    { type: "output", content: "  theme lime    — Switch to lime theme" },
    { type: "output", content: "  theme matrix  — Activate matrix mode" },
    { type: "system", content: "──────────────────────────────────────" },
    { type: "warning", content: "  Hidden commands exist. Find them." },
    { type: "system", content: "══════════════════════════════════════" },
  ],
  about: () => [
    { type: "system", content: "══════════════════════════════════════" },
    { type: "success", content: "  PROFILE // Alex Chen" },
    { type: "system", content: "══════════════════════════════════════" },
    { type: "output", content: "  Role      › Full Stack Developer" },
    { type: "output", content: "  Location  › San Francisco, CA" },
    { type: "output", content: "  XP        › 5+ years" },
    { type: "output", content: "  Status    › Open to opportunities" },
    { type: "system", content: "──────────────────────────────────────" },
    { type: "output", content: "  Passionate about React, Node.js" },
    { type: "output", content: "  and cloud-scale architecture." },
    { type: "system", content: "══════════════════════════════════════" },
  ],
  projects: () => [
    { type: "system", content: "══════════════════════════════════════" },
    { type: "success", content: "  PROJECTS // Selected Work" },
    { type: "system", content: "══════════════════════════════════════" },
    { type: "output", content: "  [01] NeuralDash   — AI Analytics" },
    { type: "output", content: "  [02] CipherChat   — E2E Messaging" },
    { type: "output", content: "  [03] VoxForge     — 3D Audio Visual" },
    { type: "output", content: "  [04] OrbitalDB    — Distributed DB" },
    { type: "system", content: "══════════════════════════════════════" },
  ],
  skills: () => [
    { type: "system", content: "══════════════════════════════════════" },
    { type: "success", content: "  SKILLS // Tech Arsenal" },
    { type: "system", content: "══════════════════════════════════════" },
    { type: "output", content: "  Frontend  › React, Next.js, TypeScript" },
    { type: "output", content: "  Backend   › Node.js, Python, Rust" },
    { type: "output", content: "  Database  › PostgreSQL, Redis" },
    { type: "output", content: "  Cloud     › AWS, GCP, Docker" },
    { type: "output", content: "  3D/WebGL  › Three.js, R3F, GLSL" },
    { type: "system", content: "══════════════════════════════════════" },
  ],
  contact: () => [
    { type: "system", content: "══════════════════════════════════════" },
    { type: "success", content: "  CONTACT // Get In Touch" },
    { type: "system", content: "══════════════════════════════════════" },
    { type: "output", content: "  Email    › alex@devportfolio.io" },
    { type: "output", content: "  GitHub   › github.com/alexchen" },
    { type: "output", content: "  LinkedIn › linkedin.com/in/alexchen" },
    { type: "system", content: "══════════════════════════════════════" },
  ],
  clear: () => [],
  "theme lime": () => [
    { type: "success", content: "  ✓ Lime theme active. Looking sharp." },
  ],
  "theme matrix": () => [{ type: "system", content: "__MATRIX__" }],
  "glitch.dev": () => [{ type: "system", content: "__GLITCH__" }],
  "root.dev": () => [
    { type: "warning", content: "  ⚠ Escalating privileges..." },
    { type: "error", content: "  ✗ ACCESS DENIED. Nice try." },
  ],
  "awaken.system": () => [{ type: "system", content: "__ADMIN__" }],
};

const colorMap: Record<OutputLine["type"], string> = {
  input: "text-[#D9FF00]",
  output: "text-[#9CA3AF]",
  error: "text-red-400",
  success: "text-[#D9FF00]",
  warning: "text-yellow-400",
  system: "text-white/25",
};

const quickCmds = ["help", "about", "projects", "skills", "theme matrix"];

const typeMap: Record<string, OutputLine["type"]> = {
  sys: "system", ok: "success", warn: "warning", err: "error", out: "output",
};

export default function Terminal({ onMatrixMode, onGlitch, onAdminTrigger, autoFocus }: TerminalProps) {
  const [input, setInput] = useState("");
  const [storeCommands, setStoreCommands] = useState<TerminalCommand[]>(() => {
    try { return loadAdminData().terminalCommands; } catch { return []; }
  });
  const [history, setHistory] = useState<OutputLine[]>([
    { type: "system", content: "╔══════════════════════════════════════╗" },
    { type: "system", content: "║   DEV.OS TERMINAL v2.0.26            ║" },
    { type: "system", content: "║   Secure Developer Interface Active  ║" },
    { type: "system", content: "╚══════════════════════════════════════╝" },
    { type: "output", content: "" },
    { type: "output", content: '  Type "help" to see available commands.' },
    { type: "output", content: "" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.terminalCommands) setStoreCommands(d.terminalCommands);
    };
    window.addEventListener("admin-updated", handler);
    return () => window.removeEventListener("admin-updated", handler);
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const inputLine: OutputLine = { type: "input", content: `[dev@os ~]$ ${cmd}` };

    if (!trimmed) {
      setHistory((prev) => [...prev, inputLine]);
      return;
    }

    setCmdHistory((prev) => [trimmed, ...prev]);
    setCmdHistoryIndex(-1);

    // Check admin store commands first
    const storeCmd = storeCommands.find(c => c.trigger.toLowerCase() === trimmed);
    if (storeCmd) {
      if (storeCmd.action === "clearTerminal") { setHistory([]); return; }
      const outputLines: OutputLine[] = storeCmd.output.map(o => ({
        type: (typeMap[o.type] ?? "output") as OutputLine["type"],
        content: o.text,
      }));
      if (storeCmd.action === "triggerMatrix") {
        setHistory(p => [...p, inputLine, ...outputLines]);
        setTimeout(onMatrixMode, 700); return;
      }
      if (storeCmd.action === "triggerGlitch") {
        setHistory(p => [...p, inputLine, ...outputLines]);
        setTimeout(onGlitch, 350); return;
      }
      if (storeCmd.action === "openAdmin") {
        setHistory(p => [...p, inputLine, ...outputLines]);
        setTimeout(onAdminTrigger, 900); return;
      }
      if (storeCmd.action === "openSection" && storeCmd.actionValue) {
        setHistory(p => [...p, inputLine, ...outputLines]);
        setTimeout(() => { const el = document.querySelector(storeCmd.actionValue!); el?.scrollIntoView({ behavior: "smooth" }); }, 300);
        return;
      }
      if (storeCmd.action === "openURL" && storeCmd.actionValue) {
        setHistory(p => [...p, inputLine, ...outputLines]);
        setTimeout(() => window.open(storeCmd.actionValue!, "_blank"), 300);
        return;
      }
      setHistory(p => [...p, inputLine, ...outputLines]);
      return;
    }

    const handler = COMMANDS[trimmed];
    if (!handler) {
      setHistory((prev) => [
        ...prev,
        inputLine,
        { type: "error", content: `  bash: ${trimmed}: command not found` },
        { type: "output", content: '  Type "help" for available commands.' },
      ]);
      return;
    }

    if (trimmed === "clear") {
      setHistory([]);
      return;
    }

    const output = handler([]);
    const hasMatrix = output.some((o) => o.content === "__MATRIX__");
    const hasGlitch = output.some((o) => o.content === "__GLITCH__");
    const hasAdmin = output.some((o) => o.content === "__ADMIN__");

    if (hasMatrix) {
      setHistory((prev) => [
        ...prev,
        inputLine,
        { type: "warning", content: "  ⚠ Initiating matrix protocol..." },
        { type: "success", content: "  ✓ Reality distortion active." },
      ]);
      setTimeout(onMatrixMode, 700);
      return;
    }

    if (hasGlitch) {
      setHistory((prev) => [
        ...prev,
        inputLine,
        { type: "warning", content: "  ⚠ Glitch sequence triggered..." },
        { type: "error", content: "  !! SYSTEM ANOMALY DETECTED !!" },
      ]);
      setTimeout(onGlitch, 350);
      return;
    }

    if (hasAdmin) {
      setHistory((prev) => [
        ...prev,
        inputLine,
        { type: "warning", content: "  ⚠ Hidden directive detected..." },
        { type: "success", content: "  ✓ Admin interface unlocked." },
      ]);
      setTimeout(onAdminTrigger, 900);
      return;
    }

    setHistory((prev) => [...prev, inputLine, ...output]);
  }, [onMatrixMode, onGlitch, onAdminTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(cmdHistoryIndex + 1, cmdHistory.length - 1);
      setCmdHistoryIndex(newIndex);
      setInput(cmdHistory[newIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.max(cmdHistoryIndex - 1, -1);
      setCmdHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : cmdHistory[newIndex]);
    }
  };

  return (
    <section
      id="terminal"
      className="relative py-24 sm:py-32"
      aria-label="Interactive terminal section"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 sm:mb-16"
        >
          <div className="section-label">
            <span className="font-mono text-xs text-[#D9FF00] tracking-[0.28em] uppercase">04 — Terminal</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3">
            Developer Console
          </h2>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-lg">
            An interactive terminal. Type commands to explore. Some commands are hidden.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-xl overflow-hidden"
          style={{
            boxShadow:
              "0 0 0 1px rgba(217,255,0,0.1), 0 0 50px rgba(217,255,0,0.06), 0 20px 60px rgba(0,0,0,0.5)",
          }}
          role="application"
          aria-label="Terminal emulator"
        >
          {/* Titlebar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#0c0c0c] border-b border-white/[0.05]">
            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-[#D9FF00]/60" />
            </div>
            <div className="font-mono text-[11px] text-[#9CA3AF] tracking-widest">
              dev.os — bash
            </div>
            <div className="font-mono text-[10px] text-[#D9FF00]/50 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9FF00] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D9FF00]" />
              </span>
              LIVE
            </div>
          </div>

          {/* Terminal body */}
          <div
            className="bg-[#080808] h-72 sm:h-96 overflow-y-auto terminal-scroll p-4 sm:p-5 font-mono text-xs leading-relaxed"
            onClick={() => inputRef.current?.focus()}
            role="log"
            aria-label="Terminal output"
          >
            {/* Subtle scanline */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
              }}
              aria-hidden="true"
            />

            {/* Output */}
            <div className="space-y-0.5 relative z-10">
              {history.map((line, i) => (
                <div
                  key={i}
                  className={`${colorMap[line.type]} whitespace-pre-wrap break-all`}
                >
                  {line.content}
                </div>
              ))}
            </div>

            {/* Input line */}
            <div className="flex items-center gap-0 mt-1 text-[#D9FF00] relative z-10">
              <span className="shrink-0 select-none">[dev@os ~]$&nbsp;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[#D9FF00] outline-none border-none font-mono text-xs caret-[#D9FF00]"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label="Terminal input"
              />
              <span className="blink text-[#D9FF00] ml-0.5" aria-hidden="true">█</span>
            </div>

            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-2 bg-[#0c0c0c] border-t border-white/[0.05]">
            <div className="font-mono text-[10px] text-[#9CA3AF] tracking-wider hidden sm:block">
              ↑↓ History &nbsp;·&nbsp; Enter to run
            </div>
            <div className="font-mono text-[10px] text-[#D9FF00]/40">
              {history.length} lines
            </div>
          </div>
        </motion.div>

        {/* Quick commands */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-2 mt-5"
          role="group"
          aria-label="Quick commands"
        >
          {quickCmds.map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                processCommand(cmd);
                inputRef.current?.focus();
              }}
              className="font-mono text-[11px] text-[#9CA3AF] border border-white/10 px-3 py-1.5 rounded-md hover:border-[rgba(217,255,0,0.3)] hover:text-[#D9FF00] transition-all duration-200"
            >
              {cmd}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
