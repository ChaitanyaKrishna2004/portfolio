"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pt-32 pb-20 lg:pt-20 w-full max-w-[100vw] box-border"
    >
      {/* Dynamic background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] top-[20%] h-[70vw] max-h-[500px] w-[70vw] max-w-[500px] rounded-full bg-accent-coral/10 blur-[80px] lg:blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] h-[80vw] max-h-[600px] w-[80vw] max-w-[600px] rounded-full bg-accent-violet/10 blur-[80px] lg:blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 relative z-10 box-border"
      >
        <div className="flex flex-col items-center justify-center gap-12 lg:justify-between lg:gap-16 lg:flex-row w-full">
          
          {/* Profile Image (First on mobile, right on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-48 w-48 sm:h-64 sm:w-64 lg:h-96 lg:w-96 perspective-1000 shrink-0 lg:order-last mx-auto"
          >
            <div className="absolute inset-0 rounded-full border border-border bg-foreground/5 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-foreground/5 bg-foreground/5 animate-[spin_15s_linear_infinite_reverse]" />
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: 10 }}
              className="relative h-full w-full overflow-hidden rounded-full shadow-2xl transition-transform duration-500 ease-out"
            >
              <Image
                src="/photo.jpeg"
                alt="Chaitanya Krishna"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Text Content (Second on mobile, left on desktop) */}
          <div className="flex w-full flex-col items-start text-left lg:order-first shrink">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mb-6 inline-block rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-accent-coral backdrop-blur-md">
                Available for new opportunities
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 font-bold tracking-tight leading-[1.1] text-[clamp(2.5rem,8vw,5.5rem)]"
            >
              Crafting{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-rose-500 to-accent-violet">
                beautiful
              </span>{" "}
              <br className="hidden sm:block" />
              digital products.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10 w-full max-w-[100%] lg:max-w-xl text-sm sm:text-base lg:text-xl leading-relaxed text-foreground/60"
            >
              Hi, I&apos;m <strong className="text-foreground">Chaitanya Krishna</strong>. I build full-stack web applications that are fast, secure, and incredibly easy to use. I love turning complex problems into simple, elegant solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <MagneticButton className="w-full sm:w-auto group bg-foreground text-background hover:bg-foreground/90">
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton className="w-full sm:w-auto">
                Contact Me
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
