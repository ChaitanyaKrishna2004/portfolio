"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  return (
    <section className="relative py-24 sm:py-32 w-full max-w-[100vw] box-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center overflow-hidden"
          >
            <h2 className="text-4xl sm:text-6xl font-bold mb-6">
              Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">extraordinary.</span>
            </h2>
            <p className="text-foreground/60 text-lg mb-12 max-w-md">
              Whether you have a project in mind, a full-time opportunity, or just want to chat about code—I&apos;m always open to discussing new ideas.
            </p>

            <div className="space-y-6">
              <a href="mailto:paruchurichaitanyakrishna6@gmail.com" className="flex items-center group w-full overflow-hidden">
                <div className="w-12 h-12 shrink-0 rounded-full border border-border bg-foreground/5 flex items-center justify-center mr-4 sm:mr-6 group-hover:bg-accent-coral/10 group-hover:border-accent-coral/30 transition-colors">
                  <Mail className="w-5 h-5 group-hover:text-accent-coral transition-colors" />
                </div>
                <span className="text-sm sm:text-lg font-medium text-foreground/80 group-hover:text-foreground transition-colors break-all">
                  paruchurichaitanyakrishna6@gmail.com
                </span>
              </a>
              
              <a href="tel:+919398130661" className="flex items-center group w-full overflow-hidden">
                <div className="w-12 h-12 shrink-0 rounded-full border border-border bg-foreground/5 flex items-center justify-center mr-4 sm:mr-6 group-hover:bg-accent-violet/10 group-hover:border-accent-violet/30 transition-colors">
                  <Phone className="w-5 h-5 group-hover:text-accent-violet transition-colors" />
                </div>
                <span className="text-sm sm:text-lg font-medium text-foreground/80 group-hover:text-foreground transition-colors break-all">
                  +91 9398130661
                </span>
              </a>

              <div className="flex gap-4 pt-8">
                <a href="#" className="w-12 h-12 rounded-full bg-foreground/5 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                  <FaGithub className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-foreground/5 border border-border flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-foreground/5 border border-border flex items-center justify-center hover:bg-[#ffa116] hover:border-[#ffa116] transition-colors">
                  <span className="font-bold">LC</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-panel rounded-3xl p-8 sm:p-12">
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/60 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-coral transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/60 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-coral transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/60 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent-coral transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <MagneticButton className="w-full py-4 mt-4 bg-foreground text-background hover:bg-foreground/90">
                  Send Message <Send className="w-4 h-4 ml-2" />
                </MagneticButton>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
