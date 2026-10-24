"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { pickText } from "@/lib/i18n";
import type { Lang } from "@/components/ds/LanguageProvider";
import type { StackTech } from "@/data/stack";

interface TechListProps {
  techs: StackTech[];
  active: number;
  onSelect: (index: number) => void;
  lang: Lang;
  reduced: boolean;
}

/**
 * Coluna esquerda: tablist vertical acessível (roving tabindex + setas).
 * O indicador ativo desliza entre os itens via `layoutId` (motion).
 */
export function TechList({ techs, active, onSelect, lang, reduced }: TechListProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const last = techs.length - 1;
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active >= last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active <= 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    onSelect(next);
    btnRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-orientation="vertical"
      aria-label="Tecnologias"
      onKeyDown={onKeyDown}
      className="flex flex-col"
    >
      {techs.map((tech, i) => {
        const isActive = i === active;
        return (
          <button
            key={tech.slug}
            ref={(el) => { btnRefs.current[i] = el; }}
            role="tab"
            id={`stack-tab-${tech.slug}`}
            aria-selected={isActive}
            aria-controls="stack-panel"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(i)}
            onMouseEnter={() => onSelect(i)}
            className="group relative flex items-center gap-4 border-b border-foreground/10 px-3 py-5 text-left outline-none transition-colors last:border-b-0 focus-visible:ring-2 focus-visible:ring-foreground/40"
          >
            {isActive && (
              <motion.span
                layoutId="stack-active"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-xl bg-foreground/[0.06]"
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
              />
            )}

            {/* Barra de acento que cresce à esquerda do item ativo */}
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 origin-center rounded-full bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ transform: `translateY(-50%) scaleY(${isActive ? 1 : 0})` }}
            />

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-black/5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
              <Image src={tech.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
            </span>

            <span className="flex min-w-0 flex-col">
              <span
                className={`font-roobert text-lg transition-colors duration-300 ${
                  isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
                }`}
              >
                {tech.name}
              </span>
              <span className="text-eyebrow uppercase tracking-widest text-muted/70">
                {pickText(tech.kind, lang)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
