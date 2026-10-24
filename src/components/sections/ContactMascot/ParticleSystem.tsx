"use client";

import { motion } from "framer-motion";

/**
 * Explosão de partículas radiais. "success" usa cores vivas e dura mais;
 * qualquer outro tipo (ex.: "poke") usa um cinza discreto e é rápido.
 */
export function ParticleSystem({ type, count }: { type: string; count: number }) {
  if (type === "none") return null;
  const colors = type === "success" ? ["#10b981", "#06b6d4", "#f59e0b"] : ["#cbd5e1"];
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i + type}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: Math.random() * 0.9 + 0.4,
            x: (Math.random() - 0.5) * 280,
            y: (Math.random() - 0.5) * 280 - 60,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: type === "success" ? 1.6 : 0.6, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full shadow-md"
          style={{ backgroundColor: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}
