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
    <section className="relative py-32 sm:py-48 w-full max-w-[100vw] box-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[1.1]">
            Professional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-coral">
              Experience.
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-24 sm:gap-32">
          {EXPERIENCES.map((exp, index) => (
            <div key={index} className="grid lg:grid-cols-12 gap-8 lg:gap-16 border-t border-border pt-16 relative">
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
                <div className="glass-panel p-8 sm:p-12 rounded-3xl">
                  <h4 className="text-lg font-semibold text-foreground mb-6">Key Responsibilities</h4>
                  <ul className="mb-8 space-y-4">
                    {exp.details.map((detail, i) => (
                      <li key={i} className="flex text-foreground/70 text-lg leading-relaxed">
                        <span className="mr-4 mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-violet/80" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-10 bg-foreground/5 border border-foreground/5 rounded-2xl p-6">
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
        </div>
      </div>
    </section>
  );
}
