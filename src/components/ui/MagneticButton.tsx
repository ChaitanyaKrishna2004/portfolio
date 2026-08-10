"use client";

import { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
}

export function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // reduce movement range by dividing
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full border border-border bg-foreground/5 px-6 py-3 font-medium text-foreground transition-colors hover:bg-foreground/10 hover:border-foreground/20",
        className
      )}
      {...props}
    >
      {/* subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-coral/10 to-accent-violet/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <span className="relative z-10 flex items-center justify-center whitespace-nowrap">{children}</span>
    </motion.button>
  );
}
