"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_PASS, setAdminAuth } from "@/lib/admin-store";
import { signInAdmin } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "email">("password");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailPwd, setEmailPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600));
    if (password === ADMIN_PASS || password === "admin") {
      setAdminAuth(true);
      router.replace("/admin");
    } else {
      setError("Access denied — invalid password");
      setPassword("");
      triggerShake();
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInAdmin(email, emailPwd);
      setAdminAuth(true);
      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      triggerShake();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "linear-gradient(rgba(217,255,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(217,255,0,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D9FF00] blur-[160px] opacity-[0.04] pointer-events-none" />

      {/* Corner brackets */}
      {[["top-4 left-4","border-l border-t"],["top-4 right-4","border-r border-t"],["bottom-4 left-4","border-l border-b"],["bottom-4 right-4","border-r border-b"]].map(([pos, brd]) => (
        <div key={pos} className={`absolute ${pos} ${brd} border-[rgba(217,255,0,0.15)] w-6 h-6`} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-[#D9FF00] font-mono text-2xl font-bold tracking-widest mb-1">DEV.OS</div>
          <div className="text-[#6b7280] font-mono text-[10px] tracking-[0.3em] uppercase">Admin Control Interface</div>
        </div>

        {/* Card */}
        <motion.div
          animate={shake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-xl p-6"
        >
          {/* Mode toggle */}
          <div className="flex gap-1 mb-6 p-1 bg-[#050505] rounded-lg border border-[rgba(255,255,255,0.04)]">
            {(["password", "email"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 text-xs font-mono rounded-md tracking-wider uppercase transition-all ${mode === m ? "bg-[#D9FF00] text-black font-bold" : "text-[#6b7280] hover:text-white"}`}>
                {m === "password" ? "Demo Mode" : "Supabase Auth"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "password" ? (
              <motion.form key="pwd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handlePasswordLogin}>
                <div className="mb-1 flex items-center justify-between">
                  <label className="font-mono text-[10px] text-[#9ca3af] tracking-widest uppercase">Admin Password</label>
                  <span className="font-mono text-[9px] text-[#D9FF00]/40">Default: 9950</span>
                </div>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••" required autoFocus
                  className="w-full bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-[#D9FF00] font-mono text-lg tracking-[0.5em] text-center outline-none focus:border-[rgba(217,255,0,0.35)] transition-colors mb-4 placeholder-[rgba(255,255,255,0.1)]"
                />
                <LoginButton loading={loading} />
              </motion.form>
            ) : (
              <motion.form key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleEmailLogin}>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="font-mono text-[10px] text-[#9ca3af] tracking-widest uppercase block mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="admin@example.com" required
                      className="w-full bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-[rgba(217,255,0,0.35)] transition-colors placeholder-[rgba(255,255,255,0.2)]" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-[#9ca3af] tracking-widest uppercase block mb-1">Password</label>
                    <input type="password" value={emailPwd} onChange={e => setEmailPwd(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-[rgba(217,255,0,0.35)] transition-colors placeholder-[rgba(255,255,255,0.2)]" />
                  </div>
                </div>
                <LoginButton loading={loading} />
              </motion.form>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center font-mono text-[11px] text-red-400">
              ✗ {error}
            </motion.p>
          )}
        </motion.div>

        <p className="text-center font-mono text-[10px] text-[#6b7280] mt-4">
          <a href="/" className="hover:text-[#D9FF00] transition-colors">← Return to portfolio</a>
        </p>
      </motion.div>
    </div>
  );
}

function LoginButton({ loading }: { loading: boolean }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-3 bg-[#D9FF00] text-black font-mono font-bold text-sm tracking-widest uppercase rounded-lg hover:shadow-[0_0_24px_rgba(217,255,0,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          Authenticating...
        </>
      ) : "Access System →"}
    </button>
  );
}
