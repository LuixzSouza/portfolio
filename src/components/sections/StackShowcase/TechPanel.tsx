"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { pickText } from "@/lib/i18n";
import type { Lang } from "@/components/ds/LanguageProvider";
import { useLocalizedHref } from "@/lib/useLocale";
import type { StackTech, StackShowcaseCopy } from "@/data/stack";
import type { TechProjectRef } from "./matchProjects";

interface TechPanelProps {
  tech: StackTech;
  projects: TechProjectRef[];
  copy: StackShowcaseCopy;
  lang: Lang;
  reduced: boolean;
}

/**
 * Coluna direita: painel de detalhe da tech ativa. Troca de conteúdo com
 * crossfade + slide (AnimatePresence), glow de acento por tecnologia e chips
 * dos projetos reais que a usam.
 */
export function TechPanel({ tech, projects, copy, lang, reduced }: TechPanelProps) {
  const loc = useLocalizedHref();
  const enter = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 26 };

  return (
    <div
      id="stack-panel"
      role="tabpanel"
      aria-labelledby={`stack-tab-${tech.slug}`}
      className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-foreground/10 bg-surface p-8 md:p-12"
    >
      {/* Glow de acento por tecnologia (respira ao trocar). */}
      <motion.div
        key={`${tech.slug}-glow`}
        aria-hidden
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, rgb(${tech.accent} / 0.28), transparent 70%)` }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={tech.slug}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={enter}
          className="relative flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
              <Image src={tech.logo} alt={tech.name} width={30} height={30} className="h-[30px] w-[30px] object-contain" />
            </span>
            <div className="flex flex-col">
              <span className="text-eyebrow uppercase tracking-widest text-muted">
                {pickText(tech.kind, lang)}
              </span>
              <span className="font-serif text-3xl italic text-foreground md:text-4xl">
                {tech.name}
              </span>
            </div>
          </div>

          <p className="font-roobert text-xl leading-snug text-foreground md:text-2xl">
            {pickText(tech.tagline, lang)}
          </p>

          <p className="max-w-[52ch] text-base leading-relaxed text-muted">
            {pickText(tech.pitch, lang)}
          </p>

          <div className="mt-2 border-t border-foreground/10 pt-6">
            <span className="text-eyebrow uppercase tracking-widest text-muted">
              {pickText(projects.length ? copy.usedInLabel : copy.usedInNone, lang)}
            </span>
            {projects.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {projects.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={loc(`/project?id=${p.id}`)}
                      className="group/chip inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-1.5 text-sm text-foreground transition-colors duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background"
                    >
                      {p.nome}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5"
                        strokeWidth={2}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
