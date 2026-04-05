"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AnimatedRowProps {
  layoutId: string;
  children: ReactNode;
  className?: string;
}

export function AnimatedRow({ layoutId, children, className }: AnimatedRowProps) {
  return (
    <motion.tr
      layout
      layoutId={layoutId}
      transition={{ layout: { type: "spring", stiffness: 200, damping: 30 } }}
      className={className}
    >
      {children}
    </motion.tr>
  );
}
