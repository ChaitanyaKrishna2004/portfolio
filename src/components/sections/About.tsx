"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function About() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden w-full max-w-[100vw] box-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-24 box-border">
        <div className="flex flex-col lg:flex-row gap-16 items-center w-full">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight">
              Driven by <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral to-accent-violet">curiosity.</span>
            </h2>
            <div className="space-y-6 text-lg text-foreground/70">
              <p>
                Currently pursuing my B.Tech in Computer Science and Engineering at Bennett University (CGPA 9.22/10), my journey in software engineering has always been about building tools that solve real problems.
              </p>
              <p>
                From architecting Multi-Branch Inventory Management Systems to engineering swipe-based developer networking platforms, I thrive at the intersection of robust backend logic and polished frontend experiences. I don&apos;t just write code; I ship products.
              </p>
              <p>
                With a deep understanding of security fundamentals—underscored by my CEHv12 certification—I ensure that everything I build is not just fast and beautiful, but also secure by design.
              </p>
            </div>
          </motion.div>

          {/* Right: Abstract Visual / Parallax Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex-1 relative w-full aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-coral/20 to-accent-violet/20 rounded-3xl rotate-6 blur-xl" />
            <div className="glass-panel absolute inset-0 rounded-3xl overflow-hidden p-2">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-foreground/5">
                {/* We use the photo again but styled differently, or just an abstract pattern */}
                <Image
                  src="/photo.jpeg"
                  alt="Chaitanya Krishna Workspace"
                  fill
                  className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
