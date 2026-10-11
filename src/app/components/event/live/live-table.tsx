"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export const rowLayoutTransition = {
  layout: { type: "spring", stiffness: 95, damping: 26 },
} as const;

interface AnimatedRowProps {
  layoutId: string;
  children: ReactNode;
  className?: string;
}

export function AnimatedRow({
  layoutId,
  children,
  className,
}: AnimatedRowProps) {
  return (
    <motion.tr
      layout
      layoutId={layoutId}
      transition={rowLayoutTransition}
      className={className}
    >
      {children}
    </motion.tr>
  );
}
