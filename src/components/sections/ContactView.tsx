"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Icon } from "@/lib/iconRegistry";
import { hoverSocial } from "@/lib/socialStyle";
import type { ButtonDef, ContactContent, SocialLink } from "@/types/content";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactView({
  eyebrow,
  title,
  titleHighlight,
  description,
  content,
  socials,
  submitBtn,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  content: ContactContent;
  socials: SocialLink[];
  submitBtn: ButtonDef;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const form = content.form;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});

    // Captured before the await: React sets e.currentTarget to null once the
    // handler returns, so touching it after the fetch throws — and that throw
    // would be caught below and reported as a failure even though the message
    // had already been saved.
    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());

    let res: Response;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Only a genuine network failure lands here now.
      setStatus("error");
      return;
    }

    if (res.ok) {
      formEl.reset();
      setStatus("sent");
      return;
    }

    const body = await res.json().catch(() => ({}));
    if (res.status === 422 && body.errors) setErrors(body.errors);
    setStatus("error");
  }

  const fieldError = (name: string) => errors[name]?.[0];

  return (
    <section className="relative pt-4 sm:pt-6 pb-24 sm:pb-32 w-full max-w-[100vw] box-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        <div className="flex flex-col text-center items-center mb-16 sm:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-accent-violet mb-2 sm:mb-4"
          >
            {eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-4"
          >
            {title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-accent-pink to-accent-violet">
              {titleHighlight}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-start overflow-hidden pt-4"
          >
            <div className="space-y-6">
              {(content.channels ?? []).map((channel) => (
                <a key={channel.type} href={channel.href} className="flex items-center group w-full overflow-hidden">
                  <div className="w-12 h-12 shrink-0 rounded-full border border-border bg-foreground/5 flex items-center justify-center mr-4 sm:mr-6 transition-colors">
                    <Icon name={channel.icon} className="w-5 h-5 transition-colors" />
                  </div>
                  <span className="text-sm sm:text-lg font-medium text-foreground/80 group-hover:text-foreground transition-colors break-all">
                    {channel.value}
                  </span>
                </a>
              ))}

              <div className="flex gap-4 pt-8">
                {socials.map((social) => {
                  const surface = hoverSocial(social);
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      style={surface.style}
                      className={`w-12 h-12 rounded-full bg-foreground/5 border border-border flex items-center justify-center transition-colors ${surface.className}`}
                    >
                      {social.icon ? (
                        <Icon name={social.icon} className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-xs tracking-tighter">{social.textBadge}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass-panel rounded-3xl p-8 sm:p-12">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                {/* Honeypot — hidden from people, tempting to bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/60 mb-2">{form.nameLabel}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-coral transition-colors"
                    placeholder={form.namePlaceholder}
                  />
                  {fieldError("name") && <p className="mt-2 text-xs text-red-500">{fieldError("name")}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/60 mb-2">{form.emailLabel}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-coral transition-colors"
                    placeholder={form.emailPlaceholder}
                  />
                  {fieldError("email") && <p className="mt-2 text-xs text-red-500">{fieldError("email")}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/60 mb-2">{form.messageLabel}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-coral transition-colors resize-none"
                    placeholder={form.messagePlaceholder}
                  />
                  {fieldError("message") && <p className="mt-2 text-xs text-red-500">{fieldError("message")}</p>}
                </div>

                <MagneticButton
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 mt-4 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : submitBtn.label}
                  <Icon name={submitBtn.icon} className="w-4 h-4 ml-2" />
                </MagneticButton>

                <div aria-live="polite" className="min-h-[1.25rem]">
                  {status === "sent" && <p className="text-sm text-green-500">{form.successMessage}</p>}
                  {status === "error" && Object.keys(errors).length === 0 && (
                    <p className="text-sm text-red-500">{form.errorMessage}</p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
