"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Shield, Layout, Terminal } from "lucide-react";
import { 
  SiReact, SiNextdotjs, SiTailwindcss, SiRedux, SiHtml5,
  SiNodedotjs, SiExpress, SiDotnet,
  SiMongodb, SiSequelize,
  SiNginx, SiCloudflare, SiGit,
  SiPython, SiJavascript, SiCplusplus, SiGnubash,
  SiOwasp, SiKalilinux
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const SKILL_CATEGORIES = [
  {
    title: "Frontend",
    icon: <Layout className="mb-4 h-8 w-8 text-accent-coral" />,
    skills: [
      { name: "React.js", logo: <SiReact /> },
      { name: "Next.js", logo: <SiNextdotjs /> },
      { name: "Tailwind CSS", logo: <SiTailwindcss /> },
      { name: "Redux", logo: <SiRedux /> },
      { name: "HTML/CSS", logo: <SiHtml5 /> },
    ],
  },
  {
    title: "Backend",
    icon: <Server className="mb-4 h-8 w-8 text-accent-violet" />,
    skills: [
      { name: "Node.js", logo: <SiNodedotjs /> },
      { name: "Express.js", logo: <SiExpress /> },
      { name: ".NET", logo: <SiDotnet /> },
      { name: "C#", logo: <Code2 className="w-4 h-4" /> },
    ],
  },
  {
    title: "Databases",
    icon: <Database className="mb-4 h-8 w-8 text-accent-coral" />,
    skills: [
      { name: "MongoDB", logo: <SiMongodb /> },
      { name: "SQL Server", logo: <Database className="w-4 h-4" /> },
      { name: "Mongoose", logo: <Database className="w-4 h-4" /> },
      { name: "Sequelize", logo: <SiSequelize /> },
    ],
  },
  {
    title: "DevOps & Cloud",
    icon: <Terminal className="mb-4 h-8 w-8 text-accent-violet" />,
    skills: [
      { name: "AWS EC2", logo: <FaAws /> },
      { name: "Nginx", logo: <SiNginx /> },
      { name: "Cloudflare", logo: <SiCloudflare /> },
      { name: "Git", logo: <SiGit /> },
      { name: "IIS / TFS", logo: <Terminal className="w-4 h-4" /> },
    ],
  },
  {
    title: "Security",
    icon: <Shield className="mb-4 h-8 w-8 text-accent-coral" />,
    skills: [
      { name: "Burp Suite", logo: <Shield className="w-4 h-4" /> },
      { name: "Nmap", logo: <Shield className="w-4 h-4" /> },
      { name: "Metasploit", logo: <SiKalilinux /> },
      { name: "OWASP", logo: <SiOwasp /> },
    ],
  },
  {
    title: "Languages & CS",
    icon: <Code2 className="mb-4 h-8 w-8 text-accent-violet" />,
    skills: [
      { name: "C++", logo: <SiCplusplus /> },
      { name: "Python", logo: <SiPython /> },
      { name: "JavaScript", logo: <SiJavascript /> },
      { name: "Bash", logo: <SiGnubash /> },
      { name: "DSA / OOP", logo: <Code2 className="w-4 h-4" /> },
    ],
  },
];

export function Skills() {
  return (
    <section className="relative py-24 sm:py-32 w-full max-w-[100vw] box-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">Arsenal</span>
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/60">
            A comprehensive toolkit for building secure, scalable, and high-performance digital products.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel group relative flex flex-col overflow-hidden rounded-3xl p-8 transition-colors bg-foreground/[0.02] hover:bg-foreground/[0.05]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-coral/10 to-accent-violet/10 opacity-100" />
              
              <div className="relative z-10">
                {category.icon}
                <h3 className="mb-6 text-xl font-semibold">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 rounded-xl border border-foreground/20 bg-foreground/10 px-3 py-2 text-sm font-medium text-foreground transition-all hover:scale-105"
                    >
                      <span className="text-lg text-accent-coral">{skill.logo}</span>
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
