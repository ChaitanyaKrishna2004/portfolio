"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function RoleCycler({ roles, intervalMs = 3000 }: { roles: string[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length < 2) return;
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % roles.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [roles.length, intervalMs]);

  // The invisible spacer reserves width so the line never reflows mid-cycle.
  const longest = useMemo(
    () => roles.reduce((a, b) => (b.length > a.length ? b : a), ""),
    [roles]
  );

  if (roles.length === 0) return null;

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
          {roles[index % roles.length]}
        </motion.span>
      </AnimatePresence>
      <span className="col-start-1 row-start-1 invisible font-bold" aria-hidden="true">
        {longest}
      </span>
    </span>
  );
}
