"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  id?: string;
}

export function SectionHeader({ eyebrow, title, description, right, id }: Props) {
  return (
    <div id={id} className="mb-4 flex flex-wrap items-end justify-between gap-4 scroll-mt-24">
      <div>
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-1 max-w-2xl text-sm text-muted"
          >
            {description}
          </motion.p>
        )}
      </div>
      {right}
    </div>
  );
}
