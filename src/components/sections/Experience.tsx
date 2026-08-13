"use client";

import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    role: "Full Stack Intern",
    company: "Futuresoft (India) Pvt. Ltd",
    duration: "Sep 2025 – Present",
    details: [
      "Built a Multi-Branch Inventory Management System and Client Billing & Subscription Monitor.",
      "Engineered role-based access control (RBAC) and secure JWT authentication workflows.",
      "Deployed scalable solutions on IIS with TFS version control.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MS SQL Server", "Sequelize"],
    impact: "Reduced manual tracking effort and eliminated missed payment incidents through automated monitoring.",
  },
  {
    role: "Cyber Security Intern",
    company: "Antihak AI Cyber Security Pvt. Ltd",
    duration: "Nov 2024 – Feb 2025",
    details: [
      "Performed comprehensive Vulnerability Assessment and Penetration Testing (VAPT).",
      "Generated detailed, OWASP-aligned vulnerability reports.",
    ],
    stack: ["Burp Suite", "Nmap", "Metasploit", "OWASP"],
    impact: "Identified and documented critical security flaws, providing actionable remediation steps to fortify digital assets.",
  },
];

export function Experience() {
  return (
    <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12 w-full max-w-[100vw] box-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        
        {/* Centered Header */}
        <div className="flex flex-col text-center items-center mb-16 sm:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase text-accent-violet mb-2 sm:mb-4"
          >
            EXPERIENCE
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 sm:mb-4"
          >
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-accent-pink to-accent-violet">Experience.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-foreground/60 max-w-2xl mx-auto"
          >
            A track record of building robust, scalable applications and securing digital assets across diverse professional environments.
          </motion.p>
        </div>

        <div className="flex flex-col gap-12 sm:gap-16">
          {EXPERIENCES.map((exp, index) => (
            <div key={index} className="grid lg:grid-cols-12 gap-8 lg:gap-12 border-t border-border pt-8 relative">
              {/* Left Column: Duration & Company */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4 lg:sticky lg:top-32 self-start"
              >
                <div className="text-sm font-bold tracking-widest text-accent-coral uppercase mb-4">
                  {exp.duration}
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2">{exp.company}</h3>
                <div className="text-xl text-foreground/50">{exp.role}</div>
              </motion.div>

              {/* Right Column: Details */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-8"
              >
                <div className="glass-panel p-6 sm:p-8 rounded-3xl">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Key Responsibilities</h4>
                  <ul className="mb-6 space-y-3">
                    {exp.details.map((detail, i) => (
                      <li key={i} className="flex text-foreground/70 text-lg leading-relaxed">
                        <span className="mr-4 mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-violet/80" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 bg-foreground/5 border border-foreground/5 rounded-2xl p-5">
                    <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">Measurable Impact</h4>
                    <p className="text-lg text-accent-coral/90">{exp.impact}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {exp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}

          {/* Download Resume Animated Section */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 border-t border-border pt-8 relative">
            <div className="lg:col-span-4" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8 flex justify-center lg:justify-start"
            >
              <a href="/Paruchuri_Chaitanya_Krishna_Resume.pdf" target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-panel group relative flex flex-row items-center justify-center gap-4 overflow-hidden rounded-3xl p-6 sm:p-8 transition-colors bg-foreground/[0.02] hover:bg-foreground/[0.05] cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/10 to-accent-violet/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-accent-coral/20 text-accent-coral group-hover:bg-accent-coral group-hover:text-background transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  </div>
                  <div className="relative z-10 text-left">
                    <h3 className="text-xl sm:text-2xl font-bold">Download Full Resume</h3>
                    <p className="text-foreground/60 text-sm mt-1">Get a comprehensive overview of my experience and skills.</p>
                  </div>
                </motion.div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
