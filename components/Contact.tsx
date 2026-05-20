"use client";
import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { addMessage } from "@/lib/admin-store";
import { useAdminData } from "@/lib/use-admin-data";
import { validateEmail, validateName, validateMessage } from "@/utils";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

const socialLinks = [
  {
    label: "GitHub",
    icon: (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    label: "Twitter",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
];

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FieldError {
  name?: string;
  email?: string;
  message?: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", message: "" };

const lastSubmitMap = new Map<string, number>();
const CLIENT_RATE_LIMIT_MS = 30_000;

function isClientRateLimited(): boolean {
  const key = "contact_submit";
  const last = lastSubmitMap.get(key) ?? 0;
  if (Date.now() - last < CLIENT_RATE_LIMIT_MS) return true;
  lastSubmitMap.set(key, Date.now());
  return false;
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const adminData = useAdminData();
  const about = { email: adminData.contact.email, location: adminData.contact.location };
  const socials = [
    { ...socialLinks[0], href: adminData.contact.github  || "https://github.com" },
    { ...socialLinks[1], href: adminData.contact.linkedin || "https://linkedin.com" },
    { ...socialLinks[2], href: adminData.contact.twitter  || "https://twitter.com" },
  ];

  const [form, setForm]       = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]   = useState<FieldError>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const validate = useCallback((): boolean => {
    const e: FieldError = {};
    if (!validateName(form.name))    e.name    = "Name must be at least 2 characters.";
    if (!validateEmail(form.email))  e.email   = "Please enter a valid email address.";
    if (!validateMessage(form.message)) e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleChange = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isClientRateLimited()) {
      addToast("Please wait before sending another message.", "warning");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Failed to send message. Please try again.", "error");
        return;
      }

      addMessage({ name: form.name, email: form.email, message: form.message });
      setSent(true);
      setForm(EMPTY_FORM);
      addToast("Message sent! I'll get back to you within 24 hours.", "success");
    } catch {
      addToast("Network error. Please check your connection and try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full border border-white/[0.08] focus:border-[rgba(217,255,0,0.35)] rounded-md px-4 py-3 text-white text-sm transition-colors duration-200 placeholder-white/20 font-mono outline-none";
  const inputStyle = { background: "rgba(255,255,255,0.025)" };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <section
        id="contact"
        ref={sectionRef}
        className="relative py-24 sm:py-32 overflow-hidden"
        aria-label="Contact section"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-[0.025]"
          style={{ background: "var(--lime)" }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-12 sm:mb-16"
          >
            <div className="section-label">
              <span className="font-mono text-xs text-[#D9FF00] tracking-[0.28em] uppercase">05 — Contact</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">Get In Touch</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <p className="text-[#9CA3AF] text-sm sm:text-lg leading-relaxed mb-10">
                Have a project in mind or want to collaborate? I&apos;m always open to interesting
                opportunities and conversations.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  {
                    label: "Email",
                    value: about.email,
                    href: `mailto:${about.email}`,
                    icon: (
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    ),
                  },
                  {
                    label: "Location",
                    value: about.location,
                    href: null,
                    icon: (
                      <>
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg glass neon-border flex items-center justify-center shrink-0" aria-hidden="true">
                      <svg className="w-4 h-4 text-[#D9FF00]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[#9CA3AF] tracking-widest uppercase mb-0.5">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="inline-link text-white hover:text-[#D9FF00] transition-colors text-sm">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-white text-sm">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3" aria-label="Social media links">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${s.label}`}
                    className="w-10 h-10 rounded-lg glass neon-border flex items-center justify-center text-[#9CA3AF] hover:text-[#D9FF00] hover:border-[rgba(217,255,0,0.35)] transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25 }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass neon-border rounded-xl p-8 sm:p-10 text-center"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="w-14 h-14 rounded-full border border-[rgba(217,255,0,0.3)] flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6 text-[#D9FF00]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Message Transmitted!</h3>
                  <p className="text-[#9CA3AF] text-sm">I&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 font-mono text-xs text-[#D9FF00] tracking-widest uppercase hover:opacity-70 transition-opacity"
                    style={{ minHeight: "unset", minWidth: "unset", display: "inline" }}
                  >
                    Send Another →
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass neon-border rounded-xl p-6 sm:p-8 space-y-5"
                  noValidate
                  aria-label="Contact form"
                >
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="font-mono text-[10px] sm:text-xs text-[#9CA3AF] tracking-widest uppercase block mb-2">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Your name"
                      autoComplete="name"
                      aria-describedby={errors.name ? "name-error" : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-red-400 font-mono text-xs" role="alert">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="font-mono text-[10px] sm:text-xs text-[#9CA3AF] tracking-widest uppercase block mb-2">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange("email")}
                      className={inputClass}
                      style={inputStyle}
                      placeholder="your@email.com"
                      autoComplete="email"
                      aria-describedby={errors.email ? "email-error" : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-red-400 font-mono text-xs" role="alert">{errors.email}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="font-mono text-[10px] sm:text-xs text-[#9CA3AF] tracking-widest uppercase block mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange("message")}
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                      placeholder="Tell me about your project..."
                      aria-describedby={errors.message ? "message-error" : undefined}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1.5 text-red-400 font-mono text-xs" role="alert">{errors.message}</p>
                    )}
                    <div className="text-right font-mono text-[10px] text-[#9CA3AF]/50 mt-1">
                      {form.message.length} / 5000
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 bg-[#D9FF00] text-black font-bold tracking-widest uppercase text-sm rounded-md hover:shadow-[0_0_30px_rgba(217,255,0,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={sending ? "Sending message..." : "Send message"}
                  >
                    {sending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Transmitting...
                      </span>
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
