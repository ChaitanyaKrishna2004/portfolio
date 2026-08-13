"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Software Developer",
  "Web Developer",
];

export function RoleCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % ROLES.length);
    }, 3000); // Change role every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-grid whitespace-nowrap items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="col-start-1 row-start-1 text-transparent bg-clip-text bg-gradient-to-r from-accent-coral via-rose-500 to-accent-violet font-bold"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible spacer to reserve width for the longest role */}
      <span className="col-start-1 row-start-1 invisible font-bold" aria-hidden="true">
        MERN Stack Developer
      </span>
    </span>
  );
}
