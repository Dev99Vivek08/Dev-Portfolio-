"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { Toast, ToastType } from "@/hooks/useToast";

const icons: Record<ToastType, string> = {
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

const colors: Record<ToastType, string> = {
  success: "text-[#D9FF00] border-[rgba(217,255,0,0.25)]",
  error: "text-red-400 border-red-400/25",
  warning: "text-yellow-400 border-yellow-400/25",
  info: "text-blue-400 border-blue-400/25",
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border bg-[#0c0c0c] backdrop-blur-xl max-w-sm w-full font-mono text-sm ${colors[toast.type]}`}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
      role="alert"
      aria-live="polite"
    >
      <span className="shrink-0 font-bold">{icons[toast.type]}</span>
      <span className="flex-1 text-white/80 text-xs leading-relaxed">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 opacity-40 hover:opacity-80 transition-opacity text-white"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
